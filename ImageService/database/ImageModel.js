var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;

function ImageModel(d){
		var dao = d;
		this.insertImageWithoutCheck=function(smd5,stype,imageData,callback){
			var scontent = new BSON.serialize({bindata:imageData});
			var tmp1 = {md5:smd5,type:stype,content:scontent};
			var ObjectID = mongodb.ObjectID;
	 		tmp1._id = new ObjectID();
			console.log("image tobe insert : "+tmp1);
			dao.imageCollection.insert(tmp1,{safe:true},function(err,result){
				console.log('insert test image oid = '+tmp1._id);
				callback(null,{"_id":tmp1._id,"md5":smd5});return;	
			});	
		}

		this.generateMD5=function(imageData){
			var md5 = crypto.createHash('md5');
			md5.update(imageData);
			var md5str = md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99
			return md5str;
		}

		this.insertImage=function(smd5,stype,imageData,callback){
			if(!smd5){
				smd5 = this.generateMD5(imageData);
			}

			dao.imageModel.checkMd5Exist(smd5,function(err,doc){
				if(err){
					callback(err,null);return;
				}else if(doc){
					callback(null,{"_id":doc._id,"md5":smd5});return;
				}else{
					dao.imageModel.insertImageWithoutCheck(smd5, stype, imageData, callback);return;
				}
			});
		}

		this.checkMd5Exist = function(smd5,callback){
			dao.imageModel.findImage({md5:smd5},callback);
		}

		this.saveImageToDB = function(path,callback){
			var imageData = fs.readFileSync(path);	

			var md5 = crypto.createHash('md5');
			md5.update(imageData);
			var md5str = md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99
			console.log(md5str);

			dao.imageModel.insertImage(md5str,'jpg',imageData,callback);return;
		}

		this.findImage = function(query,callback){
			dao.imageCollection.findOne(query, callback);
		}

		this.writeImageFromDB = function(query,callback){
			dao.imageModel.findImage(query,function(err,doc){
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

		this.removeAllImage = function(callback){
			dao.imageCollection.remove(callback);
		}

		this.getCount = function(callback){
			return dao.imageCollection.count(callback);
		}
	}

module.exports = ImageModel;