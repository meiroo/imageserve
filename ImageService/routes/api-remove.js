var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var should = require('should');
var stream = require("stream");
var util = require('../util');


router.delete('/folder', function(req, res) {
    //console.log(req);
    console.log('--------------------------------');
	console.log('DELETE /api/remove/folder/');

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
			var url = null;
			if(req.params.body)
				url = req.params.body.url;
			console.log('removing URL:'+url);
			dao.pathModel.removePathFolder(url,function(err,rmpath){
				if(err){
	 				util.sendError(res,err,dao);
	            	return;
	 			}else{
	 				console.log('res.send:'+JSON.stringify(rmpath));
	 				res.send(JSON.stringify(rmpath));
	 				res.end();
	 				dao.finish();
	 			}
			});        
		});
    });
});

router.delete('/image', function(req, res) {
    //console.log(req);
    console.log('--------------------------------');
	console.log('DELETE /api/remove/image/');

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
			var url = null;
			if(req.params.body)
				url = req.params.body.url;
			console.log('removing URL:'+url);
			dao.pathModel.removePathImage(url,function(err,rmpath){
      			if(err){
	 				util.sendError(res,err,dao);
	            	return;
	 			}else{
	 				console.log('res.send:'+JSON.stringify(rmpath));
	 				res.send(JSON.stringify(rmpath));
	 				res.end();
	 				dao.finish();
	 			}      		    		
			});       
		});
    });
});

module.exports = router;
