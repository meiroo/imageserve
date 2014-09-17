var express = require('express');
var router = express.Router();
var dao = require('../database/mongoDAO');
var path = require('path');
var should = require('should');
var stream = require("stream");

/* GET folder item */
router.get('/folder', function(req, res) {
	console.log('enter folder');
	dao.init(function(err,results){
		if(err){
			console.log("ERRRRRRRRRRRRRRRR");res.sendfile(404);
		}
		console.log(req.query);
		var url = '/';
		if(req.query.url)
			url = req.query.url;

		dao.pathModel.findSubItemByFolder(url,function(err,items){
 			should.not.exist(err);
 			items.toArray(function(err,itemarray){
 				if(err){
 					res.sendfile(404);console.log("ERRRRRRRRRRRRRRRR");return;
 				}
 				res.send({items:itemarray});res.end();			
 			});
 			
 		});        
	});	
});

router.get('/image', function(req, res) {
	dao.init(function(err,results){
		if(err){
			res.sendfile(404);console.log("ERRRRRRRRRRRRRRRR");
		}
		console.log("***********get image path**********");
		console.log(req.query);
		var url = '/';
		if(req.query.url)
			url = req.query.url;

		dao.pathModel.findImagePathContent(url,function(err,imagedata){
 			//res.set('Content-Type', "image/JPEG");
    		//res.send('back');

			// Initiate the source
			var bufferStream = new stream.Transform();
			bufferStream.push(imagedata);
			bufferStream.pipe(res);
			bufferStream.end();
			//res.send('ok');
			//res.end();
 		});        
	});	
});

module.exports = router;
