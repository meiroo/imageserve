var path = require('path');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;

function PathModel(d){
	var dao = d;
	this.checkParentURL = function(url,callback){
		dao.pathModel.findPath(url,callback);
	}

	this.addPathFolder = function(parenturl,folderurl,callback){
		var url = path.join(parenturl, folderurl);
		url = url.replace(/\\/g,"/");
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				callback(null,doc);return;
			}else{
				var path = {'url':url,type:'folder',image:0,policy:null};
				dao.pathCollection.insert(path,{safe:true},callback);	
			}
		});
	}

	this.addPathImageWithoutCheck = function(url,smd5,stype,imageData,callback){
		dao.imageModel.insertImage(smd5,stype,imageData,function(err,image){
			if(err){
				callback(err,null);return;
			}
			if(!image){
				console.log("No err, but return null...")
				callback(null,null);return;
			}
			var path = {'url':url,type:stype,image:image.md5,policy:null};
			dao.pathCollection.insert(path,{safe:true},callback);	
		});
	}

	this.updatePathImageWithoutCheck = function(url,doc,imageData,callback){
		dao.imageModel.insertImage(doc.image,doc.type,imageData,function(err,image){
			if(err){
				callback(err,null);return;
			}
			if(!image){
				console.log("No err, but return null...")
				callback(null,null);return;
			}
			dao.pathCollection.update({_id:doc._id}, doc, {}, function(err, result) {
				if(err){
					callback(err,null);return;
				}
				dao.pathCollection.findOne({"_id":doc._id,"image":doc.image}, callback);
			});
		});
	}

	this.addPathImage = function(parenturl,imageurl,smd5,stype,imageData,callback){
		var url = path.join(parenturl, imageurl);
		url = url.replace(/\\/g,"/");
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else{
				if(doc){
					if(!smd5){
						smd5 = dao.imageModel.generateMD5(imageData);
					}

					console.log(smd5 + " VS " +doc.image);

					if(smd5==doc.image){
						callback(null,doc);return;
					}else{
						//need to update
						console.log("Enter update image route!!!");
						doc.image = smd5;
						dao.pathModel.updatePathImageWithoutCheck(url,doc,imageData,callback);
					}				
				}else{
					//really need to add
					dao.pathModel.addPathImageWithoutCheck(url,smd5,stype,imageData,function(err,paths){
						if(!err){
							callback(err,paths[0]);
						}
						else{
							callback(err,paths);
						}
					});
				}
				
				
				
			}
		});
	}

	this.findImagePathContent = function(url,callback){
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				console.log('---------find image content-------');
				dao.imageModel.findImage({md5:doc.image},function(err,image){
		      		if(err){
		      			callback(err,null);return;
		      		}else if(image){
		      			
		      			var content = new BSON.deserialize(image.content.buffer);
		      			var imagedata = content.bindata.buffer;
		      			//console.log(imagedata);
		      			console.log('return image content data...');
		      			callback(null,imagedata);return;

		      		}else{
		      			callback(null,null);return;
		      		}
	      		});
			}else{
				callback(null,null);return;
			}
		});
	}

	this.findPath = function(url,callback){
		dao.pathCollection.findOne({"url":url}, callback);
	}

	this.findImageByPath = function(url,callback){

	}

	this.removeAllPath = function(callback){
			dao.pathCollection.remove(callback);
	}

	this.getCount = function(callback){
		return dao.pathCollection.count(callback);
	}

	this.findSubItemByFolder = function(folderurl,callback){
		
		var url = folderurl;
		if(url=='/')
			url = '^/[^/]+$';
		else
			url = '^' + url + '/[^/]+$';

		console.log(url);
		console.log('------------');

		dao.pathModel.findPath(folderurl,function(err,folder){
			if(err){
				callback(err,null);return;
			}else if((folder && folder.type == 'folder')||folderurl=='/'){
				var re = new RegExp(url,'i');  
				//url = url.replace(/\\/g,"/");
				dao.pathCollection.find({'url':re}, callback);
			}else{
				//no such folder
				callback("Cannot find this folder!",null);
			}
		});

		
	}
}

module.exports = PathModel;