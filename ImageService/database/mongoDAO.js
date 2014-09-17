var async = require('async');
var mongodb = require('mongodb');
var assert = require('assert');
var ImageModel = require('./ImageModel');
var PathModel = require('./PathModel');


var dao = new MongoDAO();

function MongoDAO(){

	this.init = function(callback){
		async.series(
			[
				function(callback){
					dao.connect(callback);
				},
				function(callback){
					dao.createCollection(callback);
				}
			],

			function(err,results){
				callback(err,results);
			}
		);
	}
	
	this.connect =function(callback){
		var err = false;
		dao.server = new mongodb.Server('localhost',27017,{auto_reconnect:true});
		dao.db = new mongodb.Db('ECXService',this.server,{safe:true});
		assert(this.server && this.db);
		console.log('ECXService database connected...');
		callback(null);return;
	}

	this.createCollection = function(callback){
		console.log('begin create collection.')
		if(!dao.db){
			callback({errmsg:"should connect first!"},null);return;
		}
		dao.db.open(function(err, db){
			if(err){
				console.log("Nooooooo! log open err! "+ err);
				callback(err);return;
			}
			async.series(
				[
					function(callback){
						db.createCollection('user', {safe:true},callback);
					},
					function(callback){
						db.createCollection('path', {safe:true},callback);
					},
					function(callback){
						db.createCollection('image', {safe:true},callback);
					},
					function(callback){
						db.createCollection('policy', {safe:true},callback);
					},
				],

				function(err,results){
					if(err){
						console.log("Nooooooo! "+ err);
						callback(err);return;
					}
					dao.userCollection = results[0];

					dao.pathCollection = results[1];
					dao.pathModel = new PathModel(dao);

					dao.imageCollection = results[2];
					dao.imageModel = new ImageModel(dao);

					dao.policyCollection = results[3];
					console.log("create collection success...");
					callback(err);return;				
				}
			);
		});
	}

	

	
}


module.exports = dao;