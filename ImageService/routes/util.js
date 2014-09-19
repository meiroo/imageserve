var dao = require('../database/mongoDAO');

var Util = {};
Util.sendError = function(res,err,dao){
	console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR:"+err);
	res.status(500).send({ error: err });
    res.end();
    if(dao){
    	dao.finish();
    }
}

module.exports = Util;
