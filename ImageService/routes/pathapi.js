var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var should = require('should');
var stream = require("stream");
var util = require('./util');
var dao = new MongoDAO();

/* GET folder item */
router.get('/folder', function(req, res) {
	console.log('enter folder');
	dao.init(function(err,results){
		if(err){
            util.sendError(res,err,dao);
            return;
		}
		console.log('after sendError');
		console.log(req.query);
		var url = '/';
		if(req.query.url)
			url = req.query.url;

		dao.pathModel.findSubItemByFolder(url,function(err,items){
 			if(err){
 				res.status(500).send({ error: 'findSubItemByFolder error!'+err.toString() });
            	res.end();
 			}else{
 				items.toArray(function(err,itemarray){
	 				if(err){
	 					res.status(500).send({ error: 'items.toArray error!'+err });
	            		res.end();
	 				}
	 				res.send({items:itemarray});res.end();
 				});
 			}

 			
 			
 		});        
	});	
});

router.get('/image', function(req, res) {
	dao.init(function(err,results){
		if(err){
			res.status(500).send({ error: 'DataBase init error!'+err });
            res.end();
		}
		
		console.log(req.query);
		var url = '/';
		if(req.query.url)
			url = req.query.url;
		console.log("****get image path******url= "+url);
		dao.pathModel.findImagePathContent(url,function(err,imagedata){
 			if(err){
 				res.status(500).send({ error: 'findImagePathContent error!'+err });
            	res.end();
 			}
 			if(imagedata){
 				// Initiate the source
				var bufferStream = new stream.Transform();
				bufferStream.push(imagedata);
				bufferStream.pipe(res);
				bufferStream.end();
 			}else{
 				res.status(500).send({ error: 'Cannot find this Image!'});
            	res.end();
 			}
			
 		});        
	});	
});

module.exports = router;
