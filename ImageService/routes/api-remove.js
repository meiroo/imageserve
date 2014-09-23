var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var should = require('should');
var stream = require("stream");
var util = require('./util');


router.delete('/folder', function(req, res) {
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
			var url = null;
			if(req.params.body)
				url = req.params.body.url;
			console.log('removing URL:'+url);
			dao.pathModel.removePathFolder(url,function(err,rmpath){
				if(err){
	 				util.sendError(res,err,dao);
	            	return;
	 			}else{
	 				res.send({path:rmpath});
	 				res.end();
	 				dao.finish();
	 			}
			});        
		});
    });
});

router.delete('/image', function(req, res) {
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
			var url = null;
			if(req.params.body)
				url = req.params.body.url;
			console.log('removing URL:'+url);
			dao.pathModel.removePathImage(url,function(err,rmpath){
      			if(err){
	 				util.sendError(res,err,dao);
	            	return;
	 			}else{
	 				res.send({path:rmpath});
	 				res.end();
	 				dao.finish();
	 			}      		    		
			});       
		});
    });
});

module.exports = router;
