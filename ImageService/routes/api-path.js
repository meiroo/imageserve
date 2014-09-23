var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var should = require('should');
var stream = require("stream");
var util = require('./util');


/* GET folder item */
router.get('/folder', function(req, res) {
	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
            util.sendError(res,err,dao);
            return;
		}
		console.log(req.query);
		var url = '/';
		if(req.query.url)
			url = req.query.url;

		dao.pathModel.findSubItemByFolder(url,function(err,items){
 			if(err){
 				util.sendError(res,err,dao);
            	return;
 			}else{ 				
 				if(err){
 					util.sendError(res,err,dao);
	            	return;
 				}
 				res.send({items:items});
 				res.end();
 				dao.finish(); 				
 			} 			
 		});        
	});	
});

router.get('/image', function(req, res) {
	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
		
		console.log(req.query);
		var url = '/';
		if(req.query.url)
			url = req.query.url;
		console.log("****get image path******url= "+url);
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
	});	
});

module.exports = router;
