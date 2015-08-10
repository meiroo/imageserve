
var path = require('path');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;
var async = require('async');

function PathModel(d){
	var dao = d;

	this.checkParentURL = function(url,callback){
		dao.pathModel.findPath(url,null,callback);
	}

	this.addMainURL = function(callback){
		dao.pathCollection.findOne({url:'/'}, function(err,result){
			if(err){
				callback(err,null);return;
			}else if(result){
				callback(null,result);return;
			}else{
				var path = {'url':'/',type:'folder',image:0,policy:null};
				dao.pathCollection.insert(path,{safe:true},callback);
			}
		});
	}

	this.validatePath = function(url){
		if(typeof(url)!=="string"){
			return "invalid url: NOT STRING.";
		}
		var re = /^[^*?%$#@<>^\n\t]+$/;
		if(!url.match(re)){
			return 'contain iNVALID CHRACTOR *?%$#@<>^...';
		}

		return null;
	}

	this.pathProcess = function(parenturl,folderurl){
		if(typeof(parenturl) !== "string"
			|| typeof(folderurl) !== "string"){
			//console.log("ignore url "+parenturl+" "+folderurl+" check for RegExp...");
			return folderurl;
		}
		var url = path.join(parenturl, folderurl);
		url = url.replace(/\\/g,"/");
		
		if(url.length>1){
			if(url.charAt(url.length-1)==='/'){
				url = url.substring(0,url.length-1);
			}
		}

		url = url.toLowerCase();
		//console.log("url process:"+url);
		return url;
	}

	this.addPathFolderWithoutCheck = function(url,callback){
		
		dao.pathModel.findPath(url,null,function(err,doc){
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
		
		var err1 = dao.pathModel.validatePath(parenturl);
		var err2 = dao.pathModel.validatePath(folderurl);
		if(err1 || err2){
			callback(err1 + ' '+err2,null);
			return;
		}

		var url = dao.pathModel.pathProcess(parenturl,folderurl);
		//url = url.replace(/\/\//g,"/");
		dao.pathModel.findPath(url,null,function(err,doc){
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
						dao.pathModel.findPath(url,null,callback);
					}
				});
			}
		});
	}

	this.moveFileWithoutCheck = function(item,url,newurl,callback){
		console.log('renaming from :'+url);
		item.url = newurl;
		console.log('renaming to :'+item.url);
		dao.pathCollection.update({_id:item._id}, item, {}, function(err,result){
			if(err){
				callback(err,null);
				return;
			}
			callback(null,item);

		});
	}

	this.moveFile = function(url,newurl,callback){
		var url = dao.pathModel.pathProcess('/',url);
		var newurl = dao.pathModel.pathProcess('/',newurl);
		
		var err = dao.pathModel.validatePath(newurl);
		if(err){
			callback(err ,null);
			return;
		}
		dao.pathModel.findPath(url,null,function(err,oripath){
			if(err){
				callback(err,null);
				return;
			}
			if(!oripath){
				callback({err:'No such file to move !'},null);
				return;
			}
			dao.pathModel.findPath(newurl,null,function(err,dstpath){
				if(err){
					callback(err,null);
					return;
				}
				if(dstpath){
					dao.pathModel.removePathImage(dstpath.url,function(err){
						dao.pathModel.moveFileWithoutCheck(oripath,url,newurl,callback);
					});
				}else{
					dao.pathModel.moveFileWithoutCheck(oripath,url,newurl,callback);
				}
				
			});

		});
	}

	this.renamePathFolder = function(url,newname,callback){
		var url = dao.pathModel.pathProcess('/',url);
		var newname = newname.toLowerCase();
		var oriurl = url;
		var index = oriurl.lastIndexOf('/');
		var parenturl = oriurl.substring(0,index);
		var oriname = oriurl.substring(index+1,oriurl.length);
		var dsturl = parenturl + '/' + newname;
		var dsturl = dao.pathModel.pathProcess('/',dsturl);
		var oripathobj = null;
		var err = dao.pathModel.validatePath(dsturl);
		if(err){
			callback(err ,null);
			return;
		}
		
		console.log('rename url: '+url +' to '+dsturl);
		console.log('rename name: '+oriname +' to '+newname);

		if(url=='/'){
			callback("Cannot renmae / !",null);return;
		}

		async.waterfall(
			[
				function(cb){
					dao.pathModel.findPath(url,null,cb);
				},function(oripath,cb){
					if(oripath){
						oripathobj = oripath;
						dao.pathModel.findPath(dsturl,null,cb);
					}else{
						callback('no such folder for rename!',null);return;
					}
				},function(dstpath,cb){
					if(dstpath){
						//!!!!!!!!!!!!!!
						//find some folder equal to the dsturl tobe renamed;
						//then return. without error.
						callback(null,dstpath);return;
					}else{
						//rename begin.
						var url = oriurl;
						var restr = '^' + url + '/.*$';
						restr = restr.replace(/\+/g,"\\+");
						console.log('using re '+ restr);
						var re = new RegExp(restr,'i');
						dao.pathModel.findAllPath(re,{'type': 1,'url':1},cb);
					}
				},function(arrays,cb){
					async.each(arrays, function(item, callback) {
						//console.log('processing path :' + item.url);

						var restr = '^' + oriurl+'/';
						console.log('renaming from :'+item.url);
						restr = restr.replace(/\+/g,"\\+");
						var re = new RegExp(restr,'i');
						console.log('renameing re: '+re);
						item.url = item.url.replace(re,dsturl+'/');
						console.log('renaming to :'+item.url);

						dao.pathCollection.update({_id:item._id}, item, {}, callback);
						
					},function(err){
						if(err){
							callback(err,arrays);return;
						}else
						{
							var restr = '^' + oriurl+'$';
							restr = restr.replace(/\+/g,"\\+");
							var re = new RegExp(restr,'i');
							var folder = oripathobj;
							console.log('renaming from :'+folder.url);
							folder.url = folder.url.replace(re,dsturl);
							console.log('renaming to :'+folder.url);

							dao.pathCollection.update({_id:folder._id}, folder, {}, function(err,result){
								if(err){
									callback(err,result);return;
								}else{
									dao.pathCollection.findOne({_id:folder._id}, cb);
								}
							});
							
						}
					});

				}
			],
			function(err,result){
				console.log('rename path error:' + err);
				callback(err,result);
			}
		);

		
	}

	this.removePathFolder = function(url,callback){
		var url = dao.pathModel.pathProcess('/',url);
		dao.pathModel.findPath(url,null,function(err,folder){
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
								dao.pathCollection.findAndRemove({url:url,policy:null},callback);
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

	this.addPathImageWithoutCheck = function(url,smd5,stype,policy,imageData,callback){
		console.log('addPathImageWithoutCheck for url:'+url);
		dao.imageModel.insertImage(smd5,stype,imageData,function(err,image){
			if(err){
				callback(err,null);return;
			}
			if(!image){
				console.log("No err, but return null...")
				callback(null,null);return;
			}
			var path = {'url':url,type:stype,image:image.md5,policy:policy};
			dao.pathCollection.insert(path,{safe:true},callback);	
		});
	}

	this.updatePathImageWithoutCheck = function(url,doc,imageData,callback){
		
		dao.pathCollection.remove({url:url,"policy":{"$ne":null}},function(err,result){
			if(err){
				callback(err,null);return;
			}
			console.log('remove exist policy images: ' + JSON.stringify(result));
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
		});


		
	}

	this.addPathImage = function(parenturl,imageurl,smd5,stype,policy,imageData,callback){
		
		var err1 = dao.pathModel.validatePath(parenturl);
		var err2 = dao.pathModel.validatePath(imageurl);
		if(err1 || err2){
			callback(err1 + ' '+err2,null);
			return;
		}
		
		var url = dao.pathModel.pathProcess(parenturl,imageurl);
		dao.pathModel.findPath(url,policy,function(err,doc){
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
					dao.pathModel.addPathImageWithoutCheck(url,smd5,stype,policy,imageData,function(err,paths){
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
				//first remove all policy path
				dao.pathCollection.remove({url:url,"policy":{"$ne":null}},function(err,result){
					if(err){
						callback(err,null);return;
					}
					//then check if need to remove origin image...
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
				});
				
			}
		});
	}

	this.removePathImage = function(url,callback){
		var url = dao.pathModel.pathProcess('/',url);
		dao.pathModel.findPath(url,null,function(err,doc){
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

	this.findImagePathContent = function(url,policy,callback){
		var url = dao.pathModel.pathProcess('/',url);
		dao.pathModel.findPath(url,policy,function(err,doc){
			if(err){
				callback(err,null);return;
			}else if(doc){
				dao.imageModel.findImage({md5:doc.image},function(err,image){
		      		if(err){
		      			callback(err,null);return;
		      		}else if(image){
		      			
		      			var content = new BSON.deserialize(image.content.buffer);
		      			//console.log(content);
		      			var result = {};
		      			result.imagedata = content.bindata.buffer;
		      			result.url = doc.url;
		      			result.type = doc.type;
		      			//console.log(imagedata);
		      			console.log('return image md5='+doc.image);
		      			callback(null,result);return;

		      		}else{
		      			callback(null,null);return;
		      		}
	      		});
			}else{
				callback(null,null);return;
			}
		});
	}

	this.findPath = function(url,policy,callback){
		var url = dao.pathModel.pathProcess('/',url);
		//console.log('findPath url : '+url);
		dao.pathCollection.findOne({"url":url,'policy':policy}, callback);
	}

	this.findAllPath = function(url,sort,callback){
		var url = dao.pathModel.pathProcess('/',url);
		dao.pathCollection.find({'url':url, 'policy':null},{sort: sort},function(err,items){
			if(err){
				callback(err,null);return;
			}else{
				items.toArray(function(err,array){
					//console.log(array);
					callback(err,array);return;
				});
			}
		});
	}

	this.findAllImage = function(url,sort,callback){
		var url = dao.pathModel.pathProcess('/',url);
		dao.pathCollection.find({'url':url,'policy':null,'type':{ $ne :'folder'}},{sort: sort},function(err,items){
			if(err){
				callback(err,null);return;
			}else{
				items.toArray(function(err,array){
					//console.log(array);
					callback(err,array);return;
				});
			}
		});
	}

	this.findAllFolder = function(url,sort,callback){
		var url = dao.pathModel.pathProcess('/',url);
		dao.pathCollection.find({'url':url,'policy':null,'type':'folder'},{sort: sort},function(err,items){
			if(err){
				callback(err,null);return;
			}else{
				items.toArray(function(err,array){
					//console.log(array);
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
		var url = dao.pathModel.pathProcess('/',folderurl);
		url = url.replace(/\+/g,"\\+");
		console.log('re: '+folderurl +' processed to: '+ url);

		if(url=='/')
			url = '^/[^/]+$';
		else
			url = '^' + url + '/[^/]+$';



		dao.pathModel.findPath(folderurl,null,function(err,folder){
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