var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var dao = new MongoDAO();
var util = require('../util');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
        res.sendFile(path.join(__dirname, 'index.html'));
	});
	
});

router.get('/imagetree/(*)',function(req,res){
	req.query.url = '/'+req.params[0];
	console.log('--------------------------------');
	console.log('GET /tree/'+req.params[0]);
	var url = req.query.url;

	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
		
      	if(url=='/')
			url = '^/.*$';
		else
			url = '^' + url + '(($)|(/.*$))';
		var re = new RegExp(url,'i'); 

		dao.pathModel.findAllImage(re,null,function(err,arrays){
			if(err){
      			util.sendError(res,err,dao);
            	return;
      		}else{
      			console.log('res.send: '+ JSON.stringify(arrays));
				res.send(JSON.stringify(arrays));
				res.end();
				dao.finish(); 
      		}
		});
	});
});

router.get('/tree/(*)',function(req,res){
	
	
	req.query.url = '/'+req.params[0];
	console.log('--------------------------------');
	console.log('GET /tree/'+req.params[0]);
	var url = req.query.url;
	
	var dao = new MongoDAO();
	dao.init(function(err,results){
		if(err){
			util.sendError(res,err,dao);
            return;
		}
		
      	if(url=='/')
			url = '^/.*$';
		else
			url = '^' + url + '(($)|(/.*$))';
		var re = new RegExp(url,'i'); 
		dao.pathModel.findAllFolder(re,{"url":1},function(err,arrays){
      		if(err){
      			util.sendError(res,err,dao);
            	return;
      		}

      		function checkin(ele){
      			for( i in arrays){
      				if(arrays[i].url === ele)
      					return true;
      			}
      			console.log('/tree/ checkin false : '+ele + ' is not in arrays');
      			return false;
      		}
      		var tree = [];
      		async.each(arrays, function(item, callback) {
				
				var treeEle = {};
				
				treeEle.id = item.url;
				treeEle.pid = null;
				treeEle.name = null;
				treeEle.content = item;

				if(item.url==='/'){
					treeEle.name = 'Main /';
				}else{
					var re = /(.*\/)([^/]+)/i
					var result = item.url.match(re);
					//console.log(result);
					treeEle.pid = result[1];
					if(treeEle.pid.length > 1)
						treeEle.pid = treeEle.pid.substring(0,treeEle.pid.length-1);
					treeEle.name = result[2];
					checkin(treeEle.pid);		
				}
				tree.push(treeEle);
				callback(null);			
			},function(err){
				if(err){
	      			util.sendError(res,err,dao);
	            	return;
	      		}else{
	      			console.log('res.send: '+ JSON.stringify(tree));
					res.send(JSON.stringify(tree));
					res.end();
					dao.finish(); 
	      		}
				
			});						   		
      	});
	});
});

module.exports = router;
