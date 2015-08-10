var async = require('async');
var mongodb = require('mongodb');
var assert = require('assert');
var ImageModel = require('./ImageModel');
var PathModel = require('./PathModel');
var PolicyModel = require('./PolicyModel');


function MongoDAO(){
	var dao = this;
	this.connect =function(callback){
		var err = false;
		this.server = new mongodb.Server('127.0.0.1','27017', {auto_reconnect:true});
		this.db = new mongodb.Db('ECXService',this.server,{safe:true});
		assert(this.server && this.db);
		//console.log('ECXService database connected...');
		callback(null);return;
	}

	this.createCollection = function(callback){
		//console.log('begin create collection.')
		if(!this.db){
			callback({errmsg:"should connect first!"},null);return;
		}
		this.db.open(function(err, db){
			if(err){
				console.error("ERRRRRRRRRRRRRR! log open err! "+ err);
				callback(err);return;
			}
			async.series(
				[
					function(callback){
						//db.authenticate('yusure','yusure', callback);
						callback(null,null);
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
						console.error("ERRRRRRRRRRRR! "+ err);
						callback(err);return;
					}
					dao.userCollection = results[1];

					dao.pathCollection = results[2];
					dao.pathModel = new PathModel(dao);

					dao.imageCollection = results[3];
					dao.imageModel = new ImageModel(dao);

					dao.policyCollection = results[4];
					dao.policyModel = new PolicyModel(dao);
					console.log("db.connect ok...");
					callback(err);return;				
				}
			);
		});
	}

	this.init = function(callback){
		//console.log(this);
		//console.log('-----------');
		//console.log('-----------');
		//console.log(dao);
		async.series(
			[
				function(callback){
					dao.connect(callback);
				},
				function(callback){
					dao.createCollection(callback);
				},
				function(callback){
					dao.pathModel.addMainURL(callback);
				},
				function(callback){
					var policy_thumbnail={
						name:'thumbnail',
    					content:[{type:"thumbnail",size:150}]
					};
					dao.policyModel.findPolicy({name:'thumbnail'},function(err,result){
						if(!result){
							dao.policyModel.insertPolicy(policy_thumbnail,callback);
						}else{
							callback(null);
						}
					});

					
				}
				,
				function(callback){
					//test
					//console.log('init database watermark.');
					var policy_template={
						name:'template',
    					content:[{type:"watermark",text:"模板",rotate:"0",gravity:"SouthEast"}]
					};
					dao.policyModel.findPolicy({name:'template'},function(err,result){
						if(!result){
							dao.policyModel.insertPolicy(policy_template,callback);
						}else{
							callback(null);
						}
					});
					

				}
			],

			function(err,results){
				console.log('init database over.');
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