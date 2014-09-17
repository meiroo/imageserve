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
        if(req.params.body && req.params.body.parenturl){
        	parenturl = req.params.body.parenturl;
        }else{
        	console.log("ERRRRRRRRRRRRRRRR");res.sendFile(404);

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
        	
        	dao.pathModel.addPathImage(parenturl,filename,null,'image/jpg',imageData,function(err,callback){
	      		if(err){
	      			console.log("ERRRRRRRRRRRRRRRR");
	      			res.sendfile(404);
	      		}
	      		dao.pathModel.findPath(parenturl+'/'+filename,function(err,path){
	      			if(path){
	      				res.redirect('back');
	      				res.end();
	      			}
	      			else{
	      				console.log("ERRRRRRRRRRRRRRRR");
	      				res.sendfile(404);
	      			}
	      		});
	      		
	      	});
        	
        });
    });
});

module.exports = router;
