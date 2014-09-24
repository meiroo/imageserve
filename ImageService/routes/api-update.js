var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var MongoDAO = require('../database/mongoDAO');
var util = require('./util');

router.put('/folder', function(req, res) {
    //console.log(req);
    req.pipe(req.busboy);
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      if(!req.params.body){
        req.params.body = {};
        console.log('initialize params.body...');
      }
      req.params.body[fieldname] = val;
    });

    req.busboy.on('finish', function() {
        console.log('Done parsing form!');
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

            dao.pathModel.renamePathFolder(url,newname,function(err,result){
                if(err){
                    util.sendError(res,err,dao);
                    return;
                }
                res.send({item:result});
                res.end();
                dao.finish();            
            });        
        });
    });

    
});
module.exports = router;
