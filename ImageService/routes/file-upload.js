var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var dao = require('../database/mongoDAO');

/* GET users listing. */
router.post('/', function(req, res) {
	req.pipe(req.busboy);
	req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + val);
      if(!req.params.body){
      	req.params.body = {};
      	console.log('initialize params.body...');
      }
      req.params.body[fieldname] = val;
    });
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        
        var extName = path.extname(filename);
        console.log(extName);

        var parenturl = null;
        console.log("req.params.body:" + req.params.body);
        console.log("req.params.body.parenturl:" + req.params.body.parenturl);
        if(req.params.body && req.params.body.parenturl){
        	parenturl = req.params.body.parenturl;
        }else{
        	console.log("ERRRRRRRRRRRRRRRR");
            res.status(500).send({ error: 'I need the parenturl parameter!' });
            res.end();
        }
        //console.log(req);
        var chunks=[];
		var size = 0;
        file.on('data',function(chunk){
            size += chunk.length;
            chunks.push(chunk);
        	//console.log('new chunk!');
        });
        file.on('end',function(){
        	var imageData = Buffer.concat(chunks,size);
        	//console.log(imageData);
        	
        	dao.pathModel.addPathImage(parenturl,filename,null,'image/jpg',imageData,function(err,item){
	      		if(err){
	      			console.log("file-upload addPathImage ERRRRRRRRRRRRRRRR");
	      			res.status(500).send({ error: 'addPathImage error!'+err });
                    res.end();
	      		}
	      		dao.pathModel.findPath(item[0].url,function(err,path){
	      			if(path){
	      				res.status(200).send({ path: item[0]});
	      				res.end();
	      			}
	      			else{
	      				res.status(500).send({ error: 'cannot find the upload file!' });
                        res.end();
	      			}
	      		});
	      		
	      	});
        	
        });
    });
});

module.exports = router;
