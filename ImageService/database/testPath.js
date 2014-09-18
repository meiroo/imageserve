var async = require('async');
var dao = require('./mongoDAO');
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;


describe('Mongodb PATH test', function() {
	describe('#init mongoDAO', function() {
		it('error:get collection without connect', function(done) {
	      	async.series(
				[
					function(callback){
						dao.createCollection(callback);
					}
				],

				function(err,results){
					should.exist(err);
					done();
				}
			);
   	 	});

		it('normal connect and collection', function(done) {
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
					should.not.exist(err);
					done();
				}
			);	      
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
	});

	describe('add path', function() {

		it('add top folder user1', function(done) {
	      	dao.pathModel.addPathFolder('/','user1',function(err,callback){
	      		should.not.exist(err);
	      		dao.pathModel.findPath('/user1',function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add folder /user1/image', function(done) {
	      	dao.pathModel.addPathFolder('/user1','image',function(err,callback){
	      		should.not.exist(err);
	      		dao.pathModel.findPath('/user1/image',function(err,path){
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
	      		dao.pathModel.findPath('/user1/image',function(err,path){
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
	      		dao.pathModel.findPath('/user1/image/image3',function(err,path){
	      			should.not.exist(err);
	      			path.should.not.equal(null);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});

   	 	it('add img /user1/image/aa.jpg', function(done) {
   	 		var imageData = fs.readFileSync('./image/image4.png');
	      	dao.pathModel.addPathImage('/user1/image','aa.jpg',null,'image/jpg',imageData,function(err,callback){
	      		should.not.exist(err);
	      		dao.pathModel.findPath('/user1/image/aa.jpg',function(err,path){
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
	      	dao.pathModel.addPathImage('/user1/image/image3','bb.jpg',null,'image/jpg',imageData,function(err,callback){
	      		should.not.exist(err);
	      		dao.pathModel.findPath('/user1/image/image3/bb.jpg',function(err,path){
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
   	 		dao.pathModel.findPath('/user1/image/image3/bb.jpg',function(err,path){
      			should.not.exist(err);
      			path.should.not.equal(null);
      			path.type.should.equal('image/jpg');
      			path.image.should.equal("e2e21536fefca9cec3b94cc6a5aaae26");
      			should.not.exist(path.policy);
      			done();
      		});
   	 	});

   	 	it('find img which NOT exists', function(done) {
   	 		dao.pathModel.findPath('/user1/image/image3/bccb.jpg',function(err,path){
      			should.not.exist(err);
      			should.not.exist(path);
      			done();
      		});
   	 	});

   	 	it('find folder which exists', function(done) {
   	 		dao.pathModel.findPath('/user1/image/image3',function(err,path){
      			should.not.exist(err);
      			should.exist(path);
      			console.log("******************************");
      			console.log(path.type);
      			path.type.should.equal('folder');
      			done();
      		});
   	 	});

   	 	it('find folder which NOT exists', function(done) {
   	 		dao.pathModel.findPath('/user1/image/image444',function(err,path){
      			should.not.exist(err);
      			should.not.exist(path);
      			done();
      		});
   	 	});

   	 	it('find folder which format err', function(done) {
   	 		dao.pathModel.findPath('/use@#%$@%#r1/..\/image/image444我的',function(err,path){
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
		   	 			items.toArray(function(err,items){
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
		   	 			
		   	 		});
				}
			);
   	 		
   	 		
   	 	});

		it('get item under /user1/image', function(done) {
			var imageData = fs.readFileSync('./image/image5.jpg');
	      	
   	 		async.series(
				[
					function(callback){	dao.pathModel.addPathFolder('/user1/image','__image--',callback);	}
					, function(callback){dao.pathModel.addPathImage('/user1/image','b__--b123.jpg',null,'image/jpg',imageData,callback);}
				],

				function(err,results){
					should.not.exist(err);

					dao.pathModel.findSubItemByFolder('/user1/image',function(err,items){
		   	 			should.not.exist(err);
		   	 			var itemarrays = [];
		   	 			items.toArray(function(err,items){
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
		   	 			
		   	 		});
				}
			);
   	 		
   	 		
   	 	});
   	 

		it('get item under /', function(done) {
			var imageData = fs.readFileSync('./image/image6.gif');
	      	async.series(
				[
					function(callback){	dao.pathModel.addPathFolder('/','user23-_',callback);	}
					, function(callback){dao.pathModel.addPathImage('/','index.gif',null,'image/gif',imageData,callback);}
				],

				function(err,results){
					should.not.exist(err);

					dao.pathModel.findSubItemByFolder('/',function(err,items){
		   	 			should.not.exist(err);
		   	 			var itemarrays = [];
		   	 			items.toArray(function(err,items){
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
		   	 			
		   	 		});
				}
			);
   	 	});

		it('find img content exists', function(done) {
   	 		dao.pathModel.findImagePathContent('/user1/image/image3/bb.jpg',function(err,imagedata){
      			should.not.exist(err);
      			imagedata.should.not.equal(null);
      			console.log(imagedata);
      			done();
      		});
   	 	});
   	 	

		it('add NAME_CONTAIN_SPACE img /user1/image/image 5.jpg', function(done) {
   	 		var imageData = fs.readFileSync('./image/image5.jpg');
	      	dao.pathModel.addPathImage('/user1/image','image 5.jpg',null,'image/jpg',imageData,function(err,item){
	      		should.not.exist(err);
	      		should.exist(item[0]);
	      		dao.pathModel.findPath('/user1/image/image 5.jpg',function(err,path){
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
	      	dao.pathModel.addPathImage('/user1/image','image5 - 副本.jpg',null,'image/jpg',imageData,function(err,item){
	      		should.not.exist(err);
	      		should.exist(item);
				console.log('----------------------------');
	      		console.log(item);
	      		dao.pathModel.findPath('/user1/image/image5 - 副本.jpg',function(err,path){
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
	      		
	      		dao.pathModel.findPath('/user1/image/image图片 3',function(err,path){
	      			should.not.exist(err);
	      			should.exist(path);
	      			path.type.should.equal('folder');
	      			done();
	      		});
	      		
	      	});
   	 	});


   	 	it('add folder_CONTAIN_SPECIAL_CHARACTOR /user1/image/中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg', function(done) {
	      	var imageData = fs.readFileSync('./image/中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg');
	      	dao.pathModel.addPathImage('/user1/image','中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg',null,'image/jpg',imageData,function(err,item){
	      		should.not.exist(err);
	      		should.exist(item);
				console.log('----------------------------');
	      		console.log(item);
	      		dao.pathModel.findPath('/user1/image/中文字符u=4292752432,3282675515&fm=21&gp=0中文字符.jpg',function(err,path){
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