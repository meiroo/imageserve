var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var should = require('should');
var stream = require("stream");
var util = require('../util');


function getFolder(req,res,dao){	
	console.log('--------------------------------');
	console.log('GET /api/path/folder/');
	var url = '/';
	if(req.query.url)
		url = req.query.url;
	console.log("url = "+url);

	dao.pathModel.findSubItemByFolder(url,function(err,items){
		if(err){
			util.sendError(res,err,dao);
    		return;
		}else{ 				
			if(err){
				util.sendError(res,err,dao);
        		return;
			}			
			console.log('res.send: '+ JSON.stringify(items));
			res.send(JSON.stringify(items));
			res.end();
			dao.finish(); 				
		} 			
	});        
}

function getImage(req,res,dao){		
	console.log('--------------------------------');
	console.log('GET /api/path/image/');
	var url = '/';
	if(req.query.url)
		url = req.query.url;
	console.log("url= "+url);
	dao.pathModel.findImagePathContent(url,function(err,imagedata){
		if(err){
			util.sendError(res,err,dao);
    		return;
		}
		if(imagedata){
			// Initiate the source
			var bufferStream = new stream.Transform();
			bufferStream.push(imagedata);
			bufferStream.pipe(res);
			bufferStream.end();
			dao.finish();
		}else{
    		util.sendError(res,'Cannot find this Image!',dao);
    		return;
		}
	});			
}
/* GET folder item */
router.get('/folder', function(req, res) {
	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
		getFolder(req,res,dao);
	});
});

router.get('/image', function(req, res) {
	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
		getImage(req,res,dao);
	});
	
});

router.get('/(*)',function(req,res){
	var url = req.params[0]; 
	
	req.query.url = '/'+url;
	console.log('--------------------------------');
	console.log('GET /imgapi/'+url);
	
	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
		if(req.query.url=='/'){
			getFolder(req,res,dao);return;
		}
		dao.pathModel.findPath(req.query.url,function(err,path){
  			if(err){
  				util.sendError(res,err,dao);
            	return;
  			}else if(path){
  				if(path.type=='folder'){
  					getFolder(req,res,dao);
  				}else{
  					getImage(req,res,dao);
  				}
  			}else{
  				util.sendError(res,'Cannot find this Path!',dao);
            	return;
  			}
  		});
	});
});
module.exports = router;
