var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var MongoDAO = require('../database/mongoDAO');
var util = require('../util');

/* POST upload image */
router.post('/image', function(req, res) {
    console.log('--------------------------------');
    console.log('POST /api/upload/image/');

	req.pipe(req.busboy);
	req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      if(!req.params.body){
      	req.params.body = {};
      }
      req.params.body[fieldname] = val;
    });

    req.busboy.on('file', function (fieldname, file, filename,encoding,mimetype) {
        console.log("Uploading: " + filename); 
        
        
        var extName = path.extname(filename);
        console.log(extName);

        var parenturl = null;
        console.log("req.params.body:" + req.params.body);
        console.log("req.params.body.parenturl:" + req.params.body.parenturl);
        if(req.params.body && req.params.body.parenturl){
        	parenturl = req.params.body.parenturl;
            if(req.params.body.filename)
                filename = req.params.body.filename;
        }else{
            util.sendError(res,'I need the parenturl parameter!');
            return;
        }

        if(req.params.body['Content-Type'])
            mimetype = req.params.body['Content-Type'];
        console.log("mimetype:"+mimetype);
        //console.log(req);
        var chunks=[];
		var size = 0;
        file.on('data',function(chunk){
            size += chunk.length;
            chunks.push(chunk);
        	//console.log('new chunk!');
        });
        file.on('end',function(){
            var dao = new MongoDAO();
            dao.init(function(err,results){
                if(err){
                    util.sendError(res,err,dao);
                    return;
                }
                var imageData = Buffer.concat(chunks,size);
            
                dao.pathModel.addPathImage(parenturl,filename,null,mimetype,null,imageData,function(err,item){
                    if(err){
                        util.sendError(res,err,dao);
                        return;
                    }
                    console.log('res.send: '+JSON.stringify(item));
                    res.send(JSON.stringify(item));
                    res.end();
                    dao.finish();                    
                });
            });
        	
        });
    });
});


router.post('/folder', function(req, res) {
    //console.log(req);
    console.log('--------------------------------');
    console.log('POST /api/upload/folder/');

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
            var parenturl = req.params.body.parenturl;
            if(!url || !parenturl){
                util.sendError(res,'Need the url and parent url!');
                return;
            }

            dao.pathModel.addPathFolder(parenturl,url,function(err,item){
                if(err){
                    util.sendError(res,err,dao);
                    return;
                }
                console.log('res.send: '+ JSON.stringify(item));
                res.send(JSON.stringify(item));
                res.end();
                dao.finish();
                /*
                dao.pathModel.findPath('/user1/image/image图片 3',function(err,path){
                    should.not.exist(err);
                    should.exist(path);
                    path.type.should.equal('folder');
                    done();
                });*/                
            });        
        });
    });

    
});


router.post('/policy', function(req, res) {
    //console.log(req);
    console.log('--------------------------------');
    console.log('POST /api/upload/policy/');

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
            var name = req.params.body.name;
            var content = req.params.body.content;
            if(!name || !content){
                util.sendError(res,'Need the name and content parameter!');
                return;
            }
            var policy ={};policy.name = name;policy.content=JSON.parse(content);
            dao.policyModel.insertPolicy(policy,function(err,result){
                console.log('remove result:'+result);
                if(err){
                    util.sendError(res,err,dao);
                    return;
                }
                console.log('res.send: '+ JSON.stringify(result));
                res.send(JSON.stringify(result));
                res.end();
                dao.finish();

            });

                   
        });
    });

    
});
module.exports = router;
