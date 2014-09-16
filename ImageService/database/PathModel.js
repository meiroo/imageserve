var path = require('path');

function PathModel(dao){
	this.checkParentURL = function(url,callback){
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				callback(null,true);return;
			}else{
				callback(null,null);return;
			}
		});
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
				dao.pathCollection.insert(path,{safe:true},function(err,result){
					console.log('insert path = '+path);
					if(err){
						callback(err,null);return;
					}
					callback(null,result);return;	
				});	
			}
		});
	}

	this.addPathImage = function(parenturl,imageurl,smd5,stype,imageData,callback){
		var url = path.join(parenturl, imageurl);
		url = url.replace(/\\/g,"/");
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				callback(null,doc);return;
			}else{
				//need to add
				dao.imageModel.insertImage(smd5,stype,imageData,function(err,image){
					if(err){
						callback(err,null);return;
					}
					if(!image){
						console.log("No err, but return null...")
						callback(null,null);return;
					}
					var path = {'url':url,type:stype,image:image.md5,policy:null};
					dao.pathCollection.insert(path,{safe:true},function(err,result){
						console.log('insert path = '+path);
						if(err){
							callback(err,null);return;
						}
						callback(null,result);return;	
					});	
				});
				
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

	this.findSubItemByFolder = function(url,callback){
		
		if(url=='/')
			url = '^/[a-zA-Z0-9._-]+$';
		else
			url = '^' + url + '/[a-zA-Z0-9._-]+$';

		console.log(url);
		console.log('------------');
		var re = new RegExp(url,'i');  
		//url = url.replace(/\\/g,"/");
		dao.pathCollection.find({'url':re}, callback);
	}
}

module.exports = PathModel;