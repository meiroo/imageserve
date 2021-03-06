var async = require('async');
var MongoDAO = require('../src/database/mongoDAO');
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;

var dao = new MongoDAO();

describe('Mongodb PATH test', function() {
	describe('#init mongoDAO', function() {
		it('error:get collection without connect', function(done) {
	      	dao.init(function(err,result){
	      		should.not.exist(err);
	      		done();
	      	});
   	 	});
 	});

 	describe('#clear path ', function() {
		it('clear path', function(done) {
	      	dao.pathModel.removeAllPath(function(err,rmcount){
	      		dao.pathModel.getCount(function(err,count){
	      			count.should.equal(0);
	      			done();
	      		});
	      	});
	      	
    	});

    describe('#init mongoDAO', function() {
		it('error:get collection without connect', function(done) {
	      	dao.init(function(err,result){
	      		should.not.exist(err);
	      		done();
	      	});
   	 	});
 	});

    	/*it('add Main URL...', function(done) {
		dao.pathModel.addMainURL(function(err,result){
			should.not.exist(err);		
			dao.pathCollection.findOne({url:'/'}, function(err,result){
				should.not.exist(err);
				should.exist(result);
				result.url.should.equal('/');
				done();
			});
			
		});
	});*/
	});

	describe('add path', function() {

		it('add top folder user1', function(done) {
	      	dao.pathModel.addPathFolder('/','user1',function(err,added){
	      		should.not.exist(err);
	      		added.type.should.equal('folder');
	      		dao.pathModel.findPath('/USER1',null,function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add folder /user1/iMAge', function(done) {
	      	dao.pathModel.addPathFolder('/user1','image',function(err,added){
	      		should.not.exist(err);
	      		added.type.should.equal('folder');
	      		added.url.should.equal('/user1/image');
	      		dao.pathModel.findPath('/user1/image',null,function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add duplicated folder /user1/image', function(done) {
	      	dao.pathModel.addPathFolder('/user1','image',function(err,callback){
	      		should.not.exist(err);
	      		dao.pathModel.findPath('/user1/image',null,function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add folder /user1/image/image3', function(done) {
	      	dao.pathModel.addPathFolder('/user1/image','image3',function(err,callback){
	      		should.not.exist(err);
	      		dao.pathModel.findPath('/user1/image/image3',null,function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add img /user1/image/aa.jpg', function(done) {
   	 		var imageData = fs.readFileSync('./image/image4.png');
	      	dao.pathModel.addPathImage('/user1/image','aa.jpg',null,'image/jpg',null,imageData,function(err,callback){
	      		should.not.exist(err);
	      		dao.pathModel.findPath('/user1/image/aa.jpg',null,function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('image/jpg');
	      			path.image.should.equal("fe11eb600825dea10b1839ecfb55d258");
	      			should.not.exist(path.policy);
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add img /user1/image/image3/bb.jpg', function(done) {
   	 		var imageData = fs.readFileSync('./image/image5.jpg');
	      	dao.pathModel.addPathImage('/user1/image/image3','bb.jpg',null,'image/jpg',null,imageData,function(err,addedpath){
	      		should.not.exist(err);
	      		should.exist(addedpath);
	      		should.exist(addedpath.type);
	      		should.not.exist(addedpath.policy);

	      		dao.pathModel.findPath('/user1/image/image3/bb.jpg',null,function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('image/jpg');
	      			path.image.should.equal("e2e21536fefca9cec3b94cc6a5aaae26");
	      			should.not.exist(path.policy);
	      			done();
	      		});
	      		
	      	});
   	 	});
   	 });

   	describe('get path', function() {
   	 	it('find img which exists', function(done) {
   	 		dao.pathModel.findPath('/user1/image/image3/bb.jpg',null,function(err,path){
      			should.not.exist(err);
      			path.should.not.equal(null);
      			path.type.should.equal('image/jpg');
      			path.image.should.equal("e2e21536fefca9cec3b94cc6a5aaae26");
      			should.not.exist(path.policy);
      			done();
      		});
   	 	});

   	 	it('find img which NOT exists', function(done) {
   	 		dao.pathModel.findPath('/user1/image/image3/bccb.jpg',null,function(err,path){
      			should.not.exist(err);
      			should.not.exist(path);
      			done();
      		});
   	 	});

   	 	it('find folder which exists', function(done) {
   	 		dao.pathModel.findPath('/user1/image/image3',null,function(err,path){
      			should.not.exist(err);
      			should.exist(path);
      			console.log("******************************");
      			console.log(path.type);
      			path.type.should.equal('folder');
      			done();
      		});
   	 	});

   	 	it('find folder which NOT exists', function(done) {
   	 		dao.pathModel.findPath('/user1/image/image444',null,function(err,path){
      			should.not.exist(err);
      			should.not.exist(path);
      			done();
      		});
   	 	});

   	 	it('find folder which format err', function(done) {
   	 		dao.pathModel.findPath('/use@#%$@%#r1/..\/image/image444我的',null,function(err,path){
      			should.not.exist(err);
      			should.not.exist(path);
      			done();
      		});
   	 	});
   	});

	describe('get subitem by folder', function() {
   	 	it('get item under /user1', function(done) {
   	 		async.series(
				[
					function(callback){	dao.pathModel.addPathFolder('/user1','image--',callback);	}
					, function(callback){	dao.pathModel.addPathFolder('/user1','image__',callback);	}
					, function(callback){	dao.pathModel.addPathFolder('/user1','--image__',callback);	}
					, function(callback){	dao.pathModel.addPathFolder('/user1','im-a-g_e__',callback);	}
					, function(callback){	dao.pathModel.addPathFolder('/user1','image0123',callback);	}
				],

				function(err,results){
					should.not.exist(err);

					dao.pathModel.findSubItemByFolder('/user1',function(err,items){
		   	 			should.not.exist(err);
		   	 			var itemarrays = [];
		   	 			
	   	 				for(var item in items){
	   	 					itemarrays.push(items[item].url);
	   	 					console.log(items[item].url);
	   	 				}
	   	 				itemarrays.should.containEql('/user1/image');
	   	 				itemarrays.should.not.containEql('/user1/image/image3');
	   	 				itemarrays.should.not.containEql('/user1');
	   	 				itemarrays.should.containEql('/user1/image--');
	   	 				itemarrays.should.containEql('/user1/image__');
	   	 				itemarrays.should.containEql('/user1/--image__');
	   	 				itemarrays.should.containEql('/user1/im-a-g_e__');
	   	 				itemarrays.should.containEql('/user1/image0123');
	   	 				done();
		   	 			
		   	 			
		   	 		});
				}
			);
   	 		
   	 		
   	 	});

		it('get item under /user1/image', function(done) {
			var imageData = fs.readFileSync('./image/image5.jpg');
	      	
   	 		async.series(
				[
					function(callback){	dao.pathModel.addPathFolder('/user1/image','__image--',callback);	}
					, function(callback){dao.pathModel.addPathImage('/user1/image','b__--b123.jpg',null,'image/jpg',null,imageData,callback);}
				],

				function(err,results){
					should.not.exist(err);

					dao.pathModel.findSubItemByFolder('/user1/image',function(err,items){
		   	 			should.not.exist(err);
		   	 			var itemarrays = [];
		   	 			
	   	 				for(var item in items){
	   	 					itemarrays.push(items[item].url);
	   	 					console.log(items[item].url);
	   	 				}
	   	 				itemarrays.should.containEql('/user1/image/image3');
	   	 				itemarrays.should.containEql('/user1/image/aa.jpg');
	   	 				itemarrays.should.containEql('/user1/image/__image--');
	   	 				itemarrays.should.containEql('/user1/image/b__--b123.jpg');
	   	 				itemarrays.should.not.containEql('/user1');
	   	 				itemarrays.should.not.containEql('/user1/image/image3/bb.jpg');
	   	 				done();
		   	 			
		   	 			
		   	 		});
				}
			);
   	 		
   	 		
   	 	});
   	 

		it('get item under /', function(done) {
			var imageData = fs.readFileSync('./image/image6.gif');
	      	async.series(
				[
					function(callback){	dao.pathModel.addPathFolder('/','user23-_',callback);	}
					, function(callback){dao.pathModel.addPathImage('/','index.gif',null,'image/gif',null,imageData,callback);}
				],

				function(err,results){
					should.not.exist(err);

					dao.pathModel.findSubItemByFolder('/',function(err,items){
		   	 			should.not.exist(err);
		   	 			var itemarrays = [];
		   	 			
	   	 				for(var item in items){
	   	 					itemarrays.push(items[item].url);
	   	 					console.log(items[item].url);
	   	 				}
	   	 				itemarrays.should.containEql('/user1');
	   	 				itemarrays.should.containEql('/user23-_');
	   	 				itemarrays.should.containEql('/index.gif');
	   	 				itemarrays.should.not.containEql('/user1/image');
	   	 				itemarrays.should.not.containEql('/');
	   	 				done();
		   	 			
		   	 			
		   	 		});
				}
			);
   	 	});

		it('find img content exists', function(done) {
   	 		dao.pathModel.findImagePathContent('/user1/image/image3/bb.jpg',null,function(err,result){
      			should.not.exist(err);
      			result.imagedata.should.not.equal(null);
      			console.log(result.imagedata);
      			done();
      		});
   	 	});
   	 	

		it('add NAME_CONTAIN_SPACE img /user1/image/image 5.jpg', function(done) {
   	 		var imageData = fs.readFileSync('./image/image5.jpg');
	      	dao.pathModel.addPathImage('/user1/image','image 5.jpg',null,'image/jpg',null,imageData,function(err,addedpath){
	      		should.not.exist(err);
	      		should.exist(addedpath);
	      		should.exist(addedpath.type);
	      		should.not.exist(addedpath.policy)
	      		dao.pathModel.findPath('/user1/image/image 5.jpg',null,function(err,path){
	      			should.not.exist(err);
	      			should.exist(path);
	      			should.not.exist(path.policy);
	      			should.exist(path.image);
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add NAME_CONTAIN_SPACE TWICE /user1/image/image 5.jpg', function(done) {
   	 		var imageData = fs.readFileSync('./image/image5.jpg');
	      	dao.pathModel.addPathImage('/user1/image','image 5.jpg',null,'image/jpg',null,imageData,function(err,addedpath){
	      		should.not.exist(err);
	      		should.exist(addedpath);
	      		should.exist(addedpath.type);
	      		should.not.exist(addedpath.policy)
	      		dao.pathModel.findPath('/user1/image/image 5.jpg',null,function(err,path){
	      			should.not.exist(err);
	      			should.exist(path);
	      			should.not.exist(path.policy);
	      			should.exist(path.image);
	      			done();
	      		});
	      		
	      	});
   	 	});

		
   	 	it('add NAME_CONTAIN_CHINESE /user1/image/image5 - 副本.jpg', function(done) {
   	 		var imageData = fs.readFileSync('./image/image5.jpg');
	      	dao.pathModel.addPathImage('/user1/image','image5 - 副本.jpg',null,'image/jpg',null,imageData,function(err,item){
	      		should.not.exist(err);
	      		should.exist(item);
				console.log('----------------------------');
	      		console.log(item);
	      		dao.pathModel.findPath('/user1/image/image5 - 副本.jpg',null,function(err,path){
	      			should.not.exist(err);
	      			should.exist(path);
	      			should.not.exist(path.policy);
	      			should.exist(path.image);
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add folder_CONTAIN_SPACE_CHINESE /user1/image/image图片 3', function(done) {
	      	dao.pathModel.addPathFolder('/user1/image','image图片 3',function(err,item){
	      		console.log('---------------------');
	      		console.log(item.url);
	      		should.not.exist(err);
	      		should.exist(item);
	      		//should.exist(item.type);
	      		//('folder').should.equal(item.type);
	      		
	      		dao.pathModel.findPath('/user1/image/image图片 3',null,function(err,path){
	      			should.not.exist(err);
	      			should.exist(path);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});


   	 	it('add folder_CONTAIN_SPECIAL_CHARACTOR /user1/image/中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg', function(done) {
	      	var imageData = fs.readFileSync('./image/中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg');
	      	dao.pathModel.addPathImage('/user1/image','中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg',null,'image/jpg',null,imageData,function(err,item){
	      		should.not.exist(err);
	      		should.exist(item);
				console.log('----------------------------');
	      		console.log(item);
	      		dao.pathModel.findPath('/user1/image/中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg',null,function(err,path){
	      			should.not.exist(err);
	      			should.exist(path);
	      			should.not.exist(path.policy);
	      			should.exist(path.image);
	      			done();
	      		});
	      		
	      	});
   	 	});
   	 	/**/
	});
});

describe('#update img', function() {
	it('add img /update.jpg', function(done) {
	 	var imageData = fs.readFileSync('./image/image5.jpg');
      	dao.pathModel.addPathImage('/','update.jpg',null,'image/jpg',null,imageData,function(err,addedpath){
      		should.not.exist(err);
      		should.exist(addedpath.type);
      		dao.pathModel.findPath('/update.jpg',null,function(err,path){
      			should.not.exist(err);
      			path.should.not.equal(null);
      			path.type.should.equal('image/jpg');
      			path.image.should.equal("e2e21536fefca9cec3b94cc6a5aaae26");
      			should.not.exist(path.policy);
      			done();
      		});      		
      	});
	});

	it('update_img /update.jpg', function(done) {
	 	var imageData = fs.readFileSync('./image/image.jpg');
      	dao.pathModel.addPathImage('/','update.jpg',null,'image/jpg',null,imageData,function(err,addedpath){
      		should.not.exist(err);
      		should.exist(addedpath.type);
      		dao.pathModel.findPath('/update.jpg',null,function(err,path){
      			should.not.exist(err);
      			path.should.not.equal(null);
      			path.type.should.equal('image/jpg');
      			path.image.should.equal("f3cf7e65f37cede3703957b44065fcb9");
      			should.not.exist(path.policy);
      			done();
      		});      		
      	});
	});
});

describe('#mongoDAO delete', function() {
	it('delete path and delete image', function(done) {
	 	var imageData = fs.readFileSync('./image/tobedelete.jpg');
	 	var imageData2 = fs.readFileSync('./image/image.jpg');
	  	async.series(
			[
				function(callback){dao.pathModel.addPathImage('/user1','delete.jpg',null,'image/gif',null,imageData,callback);}
				,function(callback){dao.pathModel.addPathImage('/user1','image.jpg',null,'image/gif',null,imageData2,callback);}
			],

			function(err,results){
				should.not.exist(err);							
				dao.pathModel.removePathImage('/user1/delete.jpg',function(err,rmpath){
		      		console.log('enter removePathImage!!!');
		      		should.not.exist(err);
		      		console.log(rmpath.image);
		      		rmpath.image.should.equal('53f8d6e08d2ce6f5a1c6ae2a816cf80d');
		      		dao.pathModel.findPath('/user1/delete.jpg',null,function(err,path){
		      			should.not.exist(err);
		      			should.not.exist(path);
		      			dao.imageModel.findImage({md5:'53f8d6e08d2ce6f5a1c6ae2a816cf80d'},function(err,image){
	      					should.not.exist(err);
	      					should.not.exist(image);
	      					done();
	      				});		      			
		      		});      		
				});
			}
		);
	});


	it('delete path without delete image(have other path)', function(done) {
	 	var imageData = fs.readFileSync('./image/tobedelete.jpg');
	  	async.series(
			[
				function(callback){dao.pathModel.addPathImage('/user1','delete.jpg',null,'image/gif',null,imageData,callback);}
				,function(callback){dao.pathModel.addPathImage('/user1','delete2.jpg',null,'image/gif',null,imageData,callback);}
			],

			function(err,results){
				should.not.exist(err);							
				dao.pathModel.removePathImage('/user1/delete.jpg',function(err,rmpath){
		      		console.log('enter removePathImage!!!');
		      		should.not.exist(err);
		      		console.log(rmpath.image);
		      		rmpath.image.should.equal('53f8d6e08d2ce6f5a1c6ae2a816cf80d');
		      		dao.pathModel.findPath('/user1/delete.jpg',null,function(err,path){
		      			should.not.exist(err);
		      			should.not.exist(path);
		      			dao.imageModel.findImage({md5:'53f8d6e08d2ce6f5a1c6ae2a816cf80d'},function(err,image){
	      					should.not.exist(err);
	      					should.exist(image);
	      					image.md5.should.equal('53f8d6e08d2ce6f5a1c6ae2a816cf80d');
	      					done();
	      				});		      			
		      		});      		
				});
			}
		);
	});

	it('delete path and delete image', function(done) {	 	
		
		dao.pathModel.removePathImage('/user1/delete2.jpg',function(err,rmpath){
      		console.log('enter removePathImage!!!');
      		should.not.exist(err);
      		console.log(rmpath.image);
      		rmpath.image.should.equal('53f8d6e08d2ce6f5a1c6ae2a816cf80d');
      		dao.pathModel.findPath('/user1/delete2.jpg',null,function(err,path){
      			should.not.exist(err);
      			should.not.exist(path);
      			dao.imageModel.findImage({md5:'53f8d6e08d2ce6f5a1c6ae2a816cf80d'},function(err,image){
  					should.not.exist(err);
  					should.not.exist(image);
  					done();
  				});		      			
      		});      		
		});		
	});

	it('delete folder and subitems', function(done) {	 	
		
		dao.pathModel.removePathFolder('/user1',function(err,rmpath){
      		should.not.exist(err);
      		rmpath.type.should.equal('folder');
      		dao.pathModel.findPath('/user1',null,function(err,path){
      			should.not.exist(err);
      			should.not.exist(path);	
      			dao.pathModel.findPath('/user1/image.jpg',null,function(err,path){
	      			should.not.exist(err);
	      			should.not.exist(path);	  
	      			dao.pathModel.findPath('/user1/image',null,function(err,path){
		      			should.not.exist(err);
		      			should.not.exist(path);	 
		      			dao.pathModel.findPath('/user1/image/aa.jpg',null,function(err,path){
			      			should.not.exist(err);
			      			should.not.exist(path);	  
			      			dao.pathModel.findPath('/user1/image/image3',null,function(err,path){
				      			should.not.exist(err);
				      			should.not.exist(path);
				      			dao.pathModel.findPath('/user1/image/image3/bb.jpg',null,function(err,path){
					      			should.not.exist(err);
					      			should.not.exist(path);	 
					      			done();     			
					      		});  	      			
				      		});       			
			      		});     			
		      		});     			
	      		});       			
      		});      		
		});		
	});
});

describe('once uplaod multify folder /user1/user2/user3', function() {
	it('/folder1/folder2', function(done) {
	  	dao.pathModel.addPathFolder('/','folder1/folder2',function(err,path){
      		should.not.exist(err);
      		path.url.should.equal('/folder1/folder2');
      		path.type.should.equal('folder');
      		dao.pathModel.findPath('/folder1',null,function(err,path){
      			should.not.exist(err);
      			should.exist(path);
      			path.type.should.equal('folder');
      			dao.pathModel.findPath('/folder1/folder2',null,function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('folder');
	      			done();
	      		});
      		});
      	});
	});
});

describe('rename', function() {
	it('rename of folder', function(done) {
		var imageData = fs.readFileSync('./image/tobedelete.jpg');
	  	async.series(
		[
			function(callback){dao.pathModel.addPathImage('/folder1/folder2','rename.jpg',null,'image/gif',null,imageData,callback);}
			,function(callback){dao.pathModel.addPathImage('/folder1/folder2','rename2.jpg',null,'image/gif',null,imageData,callback);}
			, function(callback){dao.pathModel.addPathFolder('/','/folder123',callback);}
			, function(callback){dao.pathModel.addPathFolder('/','/folder1/folder1/',callback);}
			, function(callback){dao.pathModel.addPathFolder('/','/tmp1/tmp2/tmp3/tmp4/',callback);}
			, function(callback){dao.pathModel.addPathFolder('/','/tmp1/tmp2/tmp3-2/tmp4-2/',callback);}


		],
		function(err,results){
			should.not.exist(err);
			dao.pathModel.renamePathFolder('/folder1','foldernew',function(err,result){
				console.log(result);
				result.url.should.equal('/foldernew');
				dao.pathModel.findPath('/folder1',null,function(err,path){
	      			should.not.exist(err);
	      			should.not.exist(path);
	      			dao.pathModel.findPath('/foldernew',null,function(err,path){
		      			should.not.exist(err);
		      			should.exist(path);
		      			path.type.should.equal('folder');
		      			dao.pathModel.findPath('/folder123',null,function(err,path){
			      			should.not.exist(err);
			      			should.exist(path);
			      			path.type.should.equal('folder');
			      			dao.pathModel.findPath('/foldernew/folder1',null,function(err,path){
			      				should.not.exist(err);
			      				should.exist(path);
				      			path.type.should.equal('folder');
				      			dao.pathModel.findPath('/foldernew/folder2',null,function(err,path){
				      				should.exist(path);
				      				dao.pathModel.findPath('/foldernew/folder2/rename.jpg',null,function(err,path){
					      				should.not.exist(err);
					      				should.exist(path);
						      			done();
						      		});
				      			});
				      			
				      		});
			      		});
		      		});
	      		});
			});

		});
	});
});

describe('get path with /user1/image/',function(){
	it('get path with /user1/image/', function(done) {
      	dao.pathModel.addPathFolder('/user1','image/',function(err,path){
      		should.not.exist(err);
      		console.log(path);
      		path.url.should.equal('/user1/image');
      		dao.pathModel.findPath('/user1/image/',null,function(err,path){
      			should.not.exist(err);
      			path.should.not.equal(null);
      			path.url.should.equal('/user1/image');
      			path.type.should.equal('folder');
      			dao.pathCollection.findOne({"url":'/user1/image/'},function(err,path2){
	      			should.not.exist(err);
	      			should.not.exist(path2);
	      			done();
	      		});
      		});
      		
      	});
	 });
});

describe('special charactor...', function() {
	it('add folder aa*******', function(done) {
	  	dao.pathModel.addPathFolder('/user1','aa*****',function(err,path){
      		should.exist(err);
      		console.log(err);
      		should.not.exist(path);
      		done();      		
      	});
	});

	it('add folder aa(1)', function(done) {
	  	dao.pathModel.addPathFolder('/user1','aa(1)',function(err,path){
      		should.not.exist(err);
      		should.exist(path);
      		done();      		
      	});
	});

	it('add folder aa%', function(done) {
	  	dao.pathModel.addPathFolder('/user1','aa%',function(err,path){
      		should.exist(err);
      		console.log(err);
      		should.not.exist(path);
      		done();      		
      	});
	});

	it('add image aa*.jpg', function(done) {
		var imageData = fs.readFileSync('./image/tobedelete.jpg');
	  	dao.pathModel.addPathImage('/user1/','aa*.jpg',null,'image/gif',null,imageData,function(err,path){
      		should.exist(err);
      		console.log(err);
      		should.not.exist(path);
      		done();      		
      	});
	});

	it('add image aa?.jpg', function(done) {
		var imageData = fs.readFileSync('./image/tobedelete.jpg');
	  	dao.pathModel.addPathImage('/user1/','aa?.jpg',null,'image/gif',null,imageData,function(err,path){
      		should.exist(err);
      		console.log(err);
      		should.not.exist(path);
      		done();      		
      	});
	});

	it('add image aa(123).jpg', function(done) {
		var imageData = fs.readFileSync('./image/tobedelete.jpg');
	  	dao.pathModel.addPathImage('/user1/','aa(123).jpg',null,'image/jpg',null,imageData,function(err,path){
      		should.not.exist(err);
      		console.log(err);
      		should.exist(path);
      		done();      		
      	});
	});

	it('add image aa%.jpg', function(done) {
		var imageData = fs.readFileSync('./image/tobedelete.jpg');
	  	dao.pathModel.addPathImage('/user1/','aa%.jpg',null,'image/gif',null,imageData,function(err,path){
      		should.exist(err);
      		console.log(err);
      		should.not.exist(path);
      		done();      		
      	});
	});

	it('find path  aa%.jpg', function(done) {
		dao.pathModel.findPath('/user1/aa%.jpg',null,function(err,path){
      		should.not.exist(err);
      		console.log(err);
      		console.log(path);
      		should.not.exist(path);
      		done();      		
      	});
	});

	it('get tree by folder', function(done) {
      	
      	var url = '/';
      	if(url=='/')
			url = '^/.*$';
		else
			url = '^' + url + '/.*$';
		var re = new RegExp(url,'i'); 
  		dao.pathModel.findAllFolder(re,null,function(err,arrays){
      		should.not.exist(err);
      		console.log(arrays);
      		should.exist(arrays);

      		function checkin(ele){
      			for( i in arrays){
      				if(arrays[i].url === ele)
      					return true;
      			}
      			console.log('false:'+ele);
      			return false;
      		}
      		
      		async.each(arrays, function(item, callback) {
					//console.log('processing path :' + item.url);
				console.log(item.url);
				var parent = null;
				var name = null;

				if(item.url==='/'){
					name = 'Main /';
				}else{
					var re = /(.*\/)([^/]+)/i
					var result = item.url.match(re);
					//console.log(result);
					parent = result[1];
					if(parent.length > 1)
						parent = parent.substring(0,parent.length-1);
					name = result[2];

					checkin(parent).should.equal(true);		
				}
				console.log('parent : '+parent + ' name: ' + name);
				callback(null);
					
				
			},function(err){
				should.not.exist(err);
				done();
			});						   		
      	});
 	});
});
		

describe('#mongoDAO close', function() {
	it('close connect', function(done) {
	  	dao.finish();
	  	done();
	});
});