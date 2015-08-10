var dao = require('./database/mongoDAO');
var log = require('./log');

var Util = {};


Util.sendError = function(res,err,dao){
	Util.logError(err);
	res.status(500).send({ error: err });
    res.end();
    if(dao){
    	dao.finish();
    }
}

Util.logError = function(err,callback){
	console.error('ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR:\n'+err);
	if(callback)
		callback(err,null);
}

Util.log = function(string){
	log.logger.info(string);
}



module.exports = Util;
