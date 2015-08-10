var async = require('async');
var MongoDAO = require('../src/database/mongoDAO');
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;

var dao = new MongoDAO();

describe('Bug test', function() {
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
    });

    describe('#init mongoDAO', function() {
		it('error:get collection without connect', function(done) {
	      	dao.init(function(err,result){
	      		should.not.exist(err);
	      		done();
	      	});
   	 	});
 	});
});

describe('#bugs--------------------', function() {
	it('add ABC folder', function(done) {
	  	dao.pathModel.addPathFolder('/','USER_ABC',function(err,added){
      		console.log('added:'+added);
      		should.not.exist(err);
      		added.type.should.equal('folder');
      		dao.pathModel.findPath('/USEr_ABC',null,function(err,path){
      			console.log('path:'+path);
      			should.not.exist(err);
      			path.should.not.equal(null);
      			path.url.should.equal('/user_abc');
      			path.type.should.equal('folder');
      			done();
      		});
      		
      	});
	});


	it('add AB+C folder', function(done) {
	  	dao.pathModel.addPathFolder('/','/USER_AB+C/subFolder1',function(err,added){
      		should.not.exist(err);
      		added.type.should.equal('folder');
      		dao.pathModel.findPath('/USEr_AB+C',null,function(err,path){
      			should.not.exist(err);
      			path.should.not.equal(null);
      			path.url.should.equal('/user_ab+c');
      			path.type.should.equal('folder');
      			done();
      		});
      		
      	});
	});

	it('find AB+C folder', function(done) {
	  	dao.pathModel.findSubItemByFolder('/USER_AB+C',function(err,items){
			should.not.exist(err);
			var itemarrays = [];
			
			for(var item in items){
				itemarrays.push(items[item].url);
				console.log(items[item].url);
			}
			itemarrays.should.containEql('/user_ab+c/subfolder1');

			done();
		});
	});

	it('add folder->rename duplicated', function(done) {
	  	dao.pathModel.addPathFolder('/','/name1',function(err,name1){
      		should.not.exist(err);
      		name1.type.should.equal('folder');
      		dao.pathModel.addPathFolder('/','/name2',function(err,name2){
      			dao.pathModel.renamePathFolder('/name2','name1',function(err,rename){
      				console.log(rename);
      				rename.url.should.equal('/name1');
      				dao.pathModel.findAllPath('/name1',null,function(err,array){
      					should.not.exist(err);
      					array.length.should.equal(1);
      					done();
      				});
      			});
      		});
      		
      	});
	});

	it('rename special folder', function(done) {
	  	dao.pathModel.renamePathFolder('/user_ab+c','userabcd',function(err,rename){
			console.log(rename);
			should.not.exist(err);
			should.exist(rename);
			rename.url.should.equal('/userabcd');
			done();
		});
	});
});


describe('#mongoDAO close', function() {
	it('close connect', function(done) {
	  	dao.finish();
	  	done();
	});
});