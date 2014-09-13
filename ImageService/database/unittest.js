var async = require('async');
var dao = require('./mongoDAO');


async.series(
	[
		function(callback){
			dao.connect(callback);
		},
		function(callback){
			dao.createCollection(callback);
		},
		function(callback){
			dao.insertImage('md5xxxxxxxx','jpg','00000000000',callback);
		}
	],

	function(err,results){
		if(err)
			console.log("Nooooooo! "+ err);
		console.log("all test success...");
	}
);