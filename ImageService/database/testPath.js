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
	});
});