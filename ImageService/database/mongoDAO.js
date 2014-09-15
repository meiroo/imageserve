var async = require('async');
var mongodb = require('mongodb');
var assert = require('assert');
var fs = require('fs');
var crypto = require('crypto');
var BSON = mongodb.BSON;

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
					callback(err);return;				
				}
			);
		});
	}

	this.insertImageWithoutCheck=function(smd5,stype,scontent,callback){
		var tmp1 = {md5:smd5,type:stype,content:scontent};
		var ObjectID = mongodb.ObjectID;
 		tmp1._id = new ObjectID();
		console.log("image tobe insert : "+tmp1);
		dao.imageCollection.insert(tmp1,{safe:true},function(err,result){
			console.log('insert test image oid = '+tmp1._id);
			callback(null,{"_id":tmp1._id,"md5":smd5});return;	
		});	
	}

	this.insertImage=function(smd5,stype,scontent,callback){
		dao.checkMd5Exist(smd5,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				callback(null,{"_id":doc._id,"md5":smd5});return;
			}else{
				dao.insertImageWithoutCheck(smd5, stype, scontent, callback);return;
			}
		});
	}

	this.checkMd5Exist = function(smd5,callback){
		dao.findImage({md5:smd5},function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				callback(null,doc);return;
			}else{
				callback(null,null);return;
			}
		});
	}

	this.saveImageToDB = function(path,callback){
		var imageData = fs.readFileSync('./image.jpg');	

		var md5 = crypto.createHash('md5');
		md5.update(imageData);
		var md5str = md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99
		console.log(md5str);

		var content = new BSON.serialize({bindata:imageData});
		dao.insertImage(md5str,'jpg',content,callback);return;
	}

	this.findImage = function(query,callback){
		dao.imageCollection.findOne(query, callback);
	}

	this.writeImageFromDB = function(query,callback){
		dao.findImage(query,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				var content = new BSON.deserialize(doc.content.buffer);
				fs.writeFileSync(doc._id+'.jpg', content.bindata.buffer,"binary");
				callback(null,doc._id+'.jpg');return;
			}else{
				callback({errmsg:"Cannot find this Image!"},"Cannot find this Image!");return;
			}
		});
	}
}


module.exports = dao;