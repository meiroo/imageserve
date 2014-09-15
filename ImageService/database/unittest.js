var async = require('async');
var mongodb = require('mongodb');
var fs = require('fs');
var dao = require('./mongoDAO');
var BSON = mongodb.BSON;
var crypto = require('crypto');



async.series(
	[
		function(callback){
			dao.connect(callback);
		},
		function(callback){
			dao.createCollection(callback);
		},
		function(callback){
			dao.saveImageToDB('./image.jpg',callback);
		}
	],

	function(err,results){
		if(err)
			console.log("Nooooooo! "+ err);

		var insertObj = results[2];
		console.log('Image inserted id = ',insertObj);
		dao.writeImageFromDB({md5:'f3cf7e65f37cede3703957b44065fcb9'},function(err,filename){
			console.log(filename);
		});
	}
);