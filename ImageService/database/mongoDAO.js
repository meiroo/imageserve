var async = require('async');
var mongodb = require('mongodb');
var assert = require('assert');
var dao = new MongoDAO();

function MongoDAO(){

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
					dao.imageCollection = results[2];
					dao.policyCollection = results[3];
					console.log("create collection success...");
					console.log("imageCollection1 : "+dao.imageCollection);
					callback(err);return;				
				}
			);
		});
	}

	this.insertImage=function(smd5,stype,scontent,callback){
		var tmp1 = {md5:smd5,type:stype,content:scontent};
		var ObjectID = mongodb.ObjectID;
 		tmp1._id = new ObjectID();
		console.log("imageCollection2 : "+dao.imageCollection);
		dao.imageCollection.insert(tmp1,{safe:true},function(err,result){
			console.log('insert test image md5 = '+tmp1._id);
			callback(null,tmp1._id);return;	
		});
		
	}
}


module.exports = dao;