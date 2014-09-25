var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var util = require('../util');
var dao = new MongoDAO();
/* GET home page. */
router.get('/', function(req, res) {
	dao.init(function(err,results){
		if(err){
			 util.sendError(res,err,dao);
			 return;
		}
        res.sendFile(path.join(__dirname, '../public/gallery.html'));
	});
	
});

module.exports = router;
