var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res) {
	console.log('!!file upload!!');
  	res.send('respond with a resource');
});

module.exports = router;
