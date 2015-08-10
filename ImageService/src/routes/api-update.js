var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var MongoDAO = require('../database/mongoDAO');
var util = require('../util');

router.put('/folder', function(req, res) {
    //console.log(req);
    console.log('--------------------------------');
    console.log('PUT /api/update/folder/');

    req.pipe(req.busboy);
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      if(!req.params.body){
        req.params.body = {};
      }
      req.params.body[fieldname] = val;
    });

    req.busboy.on('finish', function() {
        var dao = new MongoDAO();
        dao.init(function(err,results){
            if(err){
                util.sendError(res,err,dao);
                return;
            }
            console.log(req.params.body);
            var url = req.params.body.url;
            var newname = req.params.body.newname;
            if(!url || !newname){
                util.sendError(res,'Need the url and newname!');
                return;
            }

            dao.pathModel.renamePathFolder(url,newname,function(err,item){
                if(err){
                    util.sendError(res,err,dao);
                    return;
                }
                console.log('res.send: '+ JSON.stringify(item));
                res.send(JSON.stringify(item));
                res.end();
                dao.finish();            
            });        
        });
    });

    
});


router.put('/image', function(req, res) {
    //console.log(req);
    console.log('--------------------------------');
    console.log('PUT /api/update/image/');

    req.pipe(req.busboy);
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      if(!req.params.body){
        req.params.body = {};
      }
      req.params.body[fieldname] = val;
    });

    req.busboy.on('finish', function() {
        var dao = new MongoDAO();
        dao.init(function(err,results){
            if(err){
                util.sendError(res,err,dao);
                return;
            }
            console.log(req.params.body);
            var url = req.params.body.url;
            var newurl = req.params.body.newurl;
            if(!url || !newurl){
                util.sendError(res,'Need the url and newurl!');
                return;
            }

            dao.pathModel.moveFile(url,newurl,function(err,item){
                if(err){
                    util.sendError(res,err,dao);
                    return;
                }
                console.log('res.send: '+ JSON.stringify(item));
                res.send(JSON.stringify(item));
                res.end();
                dao.finish();            
            });        
        });
    });

    
});
module.exports = router;
