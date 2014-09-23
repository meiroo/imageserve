
var path = require('path');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;
var async = require('async');

function PathModel(d){
	var dao = d;
	this.checkParentURL = function(url,callback){
		dao.pathModel.findPath(url,callback);
	}

	this.addPathFolderWithoutCheck = function(url,callback){
		
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				callback(null,doc);return;
			}else{
				console.log('adding folder path :' + url);
				var path = {'url':url,type:'folder',image:0,policy:null};
				dao.pathCollection.insert(path,{safe:true},callback);
			}
		})		
	}

	this.addPathFolder = function(parenturl,folderurl,callback){
		var url = path.join(parenturl, folderurl);
		url = url.replace(/\\/g,"/");
		//url = url.replace(/\/\//g,"/");
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				callback(null,doc);return;
			}else{
				var patharray=[];
				var current_url = url;
				patharray.push(current_url);
				while(current_url){
					var index = current_url.lastIndexOf('/');
					current_url = current_url.substring(0,index);
					if(current_url)
						patharray.push(current_url);
				}
				patharray = patharray.reverse();
				console.log(patharray);

				async.each(patharray, function(path, callback) {
					dao.pathModel.addPathFolderWithoutCheck(path,callback);
				},function(err){
					if(err){
						callback(err,null);return;
					}else
					{
						dao.pathModel.findPath(url,callback);
					}
				});
			}
		});
	}

	this.renamePathFolder = function(url,newname,callback){
		var oriurl = url;
		var index = oriurl.lastIndexOf('/');
		var parenturl = oriurl.substring(0,index);
		var oriname = oriurl.substring(index+1,oriurl.length);
		var dsturl = parenturl + '/' + newname;
		console.log('rename url: '+url +' to '+dsturl);
		console.log('rename name: '+oriname +' to '+newname);

		if(url=='/'){
			callback("Cannot renmae / !",null);return;
		}

		dao.pathModel.findPath(url,function(err,folder){
			if(err){
				callback(err,null);return;
			}else if(folder){
				var url = oriurl;
				url = '^' + url + '/.*$';
				console.log('using re '+ url);
				var re = new RegExp(url,'i');
				dao.pathModel.findAllPath(re,{'type': 1,'url':1},callback);

			}else{
				callback(null,null);return;
			}
		});
	}

	this.removePathFolder = function(url,callback){
		dao.pathModel.findPath(url,function(err,folder){
			if(err){
				callback(err,null);return;
			}else if(folder){
				dao.pathModel.findSubItemByFolder(url,function(err,items){
					if(err){
						callback(err,null);return;
					}else{
						console.log('items:' + items);
						async.each(items, function(item, callback) {
							console.log('processing path :' + item.url);
							if(item.type=='folder'){
						  		dao.pathModel.removePathFolder(item.url,callback);
						  	}else{
						  		dao.pathModel.removePathImage(item.url,callback);
						  	}
						},function(err){
							if(err){
								callback(err,folder);return;
							}else
							{
								console.log('url:'+url + ' Finally, remove the parent folder..');
								dao.pathCollection.findAndRemove({url:url},callback);
								return;
							}
						});
					}
				});
			}else{
				callback(null,null);return;
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

	this.removePathImageWithoutCheck =  function(url,callback){
		console.log('removing image :'+url);
		dao.pathCollection.findAndRemove({url:url},function(err,rmpath){
			if(err){
				callback(err,null);return;
			}else if(rmpath){
				dao.pathCollection.findOne({image:rmpath.image},function(err,md5path){
					if(!md5path){
						console.log('Need to remove image also... md5: '+ rmpath.image);
						dao.imageModel.removeImage(rmpath.image,function(err,rmimage){
							callback(err,rmpath);return;
						})
					}else{
						callback(err,rmpath);return;
					}
				});
			}
		});
	}

	this.removePathImage = function(url,callback){
		dao.pathModel.findPath(url,function(err,doc){
			if(err){
				callback(err,null);return;
			}else{
				if(doc){
					dao.pathModel.removePathImageWithoutCheck(url,callback);
					return;	
				}else{
					//nothing to delete..
					callback(null,null);return;
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

	this.findAllPath = function(url,sort,callback){
		dao.pathCollection.find({'url':url},{sort: sort},function(err,items){
			if(err){
				callback(err,null);return;
			}else{
				items.toArray(function(err,array){
					console.log(array);
					callback(err,array);return;
				});
			}
		});
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
				dao.pathModel.findAllPath(re,{'type': 1,'url':1},callback);
			}else{
				//no such folder
				callback("Cannot find this folder!",null);
			}
		});

		
	}
}

module.exports = PathModel;