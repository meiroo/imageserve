var express = require('express');
var router = express.Router();
var MongoDAO = require('../database/mongoDAO');
var path = require('path');
var dao = new MongoDAO();
/* GET home page. */
router.get('/', function(req, res) {
	dao.init(function(err,results){
		if(err)
			res.sendFile(404);
        res.sendFile(path.join(__dirname, '../public/gallery.html'));
	});
	
});

module.exports = router;
