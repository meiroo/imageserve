var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var should = require('should');
var stream = require("stream");
var util = require('../util');
var policyManager = require('../components/PolicyManager');


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

function writeImgToRes(result,res){
	var filename = "";
	var url = result.url;
	if(url.match(/[^/]+$/))
		filename = url.match(/[^/]+$/);
	res.setHeader('Content-Type', result.type); 
	//res.setHeader('content-disposition', "attachment; filename="+encodeURIComponent(filename)); 
	console.log("res.header Content-Type:" + result.type + " " + 'content-disposition:' + "attachment; filename="+filename); 

	var bufferStream = new stream.Transform();
	bufferStream.push(result.imagedata);
	bufferStream.pipe(res);
	bufferStream.end();
}

function getImage(req,res,dao){		
	console.log('--------------------------------');
	console.log('GET /api/path/image/');
	var url = '/';
	if(req.query.url)
		url = req.query.url;
	var policy = null;
	if(req.query.policy){
		policy = req.query.policy;
		console.log("url with policy("+policy+"): "+url);
	}else{
		console.log("url: "+url);
	}
	if(policy){
		policyManager.getPolicyImage(dao,url,policy,function(err,result){
			if(err){
				util.sendError(res,err,dao);
	    		return;
			}
			if(result){
				// Initiate the source
				writeImgToRes(result,res);
				dao.finish();
			}else{
	    		util.sendError(res,'error return null!',dao);
	    		return;
			}
		});
	}else{
		dao.pathModel.findImagePathContent(url,null,function(err,result){
			if(err){
				util.sendError(res,err,dao);
	    		return;
			}
			if(result){
				// Initiate the source
				writeImgToRes(result,res);
				dao.finish();
			}else{
	    		util.sendError(res,'Cannot find this Image!',dao);
	    		return;
			}
		});	
	}
	
			
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
	url = decodeURIComponent(url);
	req.query.url = url;
	if(url.charAt(0) !== '/')
		req.query.url = '/'+url;
	console.log('--------------------------------');
	console.log('GET /imgapi'+url);
	
	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
		if(req.query.url=='/'){
			getFolder(req,res,dao);return;
		}
		dao.pathModel.findPath(req.query.url,null,function(err,path){
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
