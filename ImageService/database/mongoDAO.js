var async = require('async');
var mongodb = require('mongodb');
var assert = require('assert');
var ImageModel = require('./ImageModel');
var PathModel = require('./PathModel');


function MongoDAO(){
	var dao = this;
	this.connect =function(callback){
		var err = false;
		this.server = new mongodb.Server('172.16.50.221','27017', {auto_reconnect:true,sslKey:'yusure',sslPass:'yusure'});
		this.db = new mongodb.Db('ECXService',this.server,{safe:true});
		assert(this.server && this.db);
		console.log('ECXService database connected...');
		callback(null);return;
	}

	this.createCollection = function(callback){
		console.log('begin create collection.')
		if(!this.db){
			callback({errmsg:"should connect first!"},null);return;
		}
		this.db.open(function(err, db){
			if(err){
				console.log("Nooooooo! log open err! "+ err);
				callback(err);return;
			}
			async.series(
				[
					function(callback){
						db.authenticate('yusure','yusure', callback);
					},
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
					console.log("db.connect ok...");
					callback(err);return;				
				}
			);
		});
	}

	this.init = function(callback){
		//console.log(this);
		console.log('-----------');
		console.log('-----------');
		//console.log(dao);
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

	this.finish = function(){
		console.log('db.close!');
		this.db.close();
	}
}


module.exports = MongoDAO;