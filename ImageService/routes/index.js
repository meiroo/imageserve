var express = require('express');
var router = express.Router();
var dao = require('../database/mongoDAO');
var path = require('path');
/* GET home page. */
router.get('/', function(req, res) {
	dao.init(function(err,results){
		if(err)
			res.sendfile(404);
        res.sendfile(path.join(__dirname, '../public/gallery.html'));
	});
	
});

module.exports = router;
