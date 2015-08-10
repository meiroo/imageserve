var async = require('async');
var MongoDAO = require('../src/database/mongoDAO');
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;

var dao = new MongoDAO();

describe('Mongodb unit test', function() {
	describe('#init mongoDAO', function() {
		it('error:get collection without connect', function(done) {
	      	dao.init(function(err,result){
	      		should.not.exist(err);
	      		done();
	      	});
   	 	});
 	});

 	describe('#clear image ', function() {
		it('clear image', function(done) {
	      	dao.imageModel.removeAllImage(function(err,rmcount){
	      		dao.imageModel.getCount(function(err,count){
	      			count.should.equal(0);
	      			done();
	      		});
	      	});
	      	
    	});
	});


	describe('#put image to database', function() {
		it('save image.jpg', function(done) {
	      	dao.imageModel.saveImageToDB('./image/image.jpg',function(err,obj){
	      		should.not.exist(err);
	      		obj.md5.should.equal('f3cf7e65f37cede3703957b44065fcb9');
	      		dao.imageModel.getCount(function(err,count){
	      			count.should.equal(1);
	      			done();
	      		});
	      	});
    	});

    	it('save image2.jpg', function(done) {
	      	dao.imageModel.saveImageToDB('./image/image2.jpg',function(err,obj){
	      		should.not.exist(err);
	      		obj.md5.should.equal('39e878f1709a2c749a83e60eaeaedda5');
	      		dao.imageModel.getCount(function(err,count){
	      			count.should.equal(2);
	      			done();
	      		});
	      	});
    	});

    	it('save png file', function(done) {
	      	dao.imageModel.saveImageToDB('./image/image3.png',function(err,obj){
	      		should.not.exist(err);
	      		obj.md5.should.equal('fe11eb600825dea10b1839ecfb55d258');
	      		dao.imageModel.getCount(function(err,count){
	      			count.should.equal(3);
	      			done();
	      		});
	      	});
    	});

    	it('save the same file with diffrent name', function(done) {
	      	dao.imageModel.saveImageToDB('./image/image4.png',function(err,obj){
	      		should.not.exist(err);
	      		obj.md5.should.equal('fe11eb600825dea10b1839ecfb55d258');
	      		dao.imageModel.getCount(function(err,count){
	      			count.should.equal(3);
	      			done();
	      		});
	      	});
    	});

    	it('save Image content without md5', function(done) {
	      	
	      	var imageData = fs.readFileSync('./image/image4.png');	
			dao.imageModel.insertImage(null,'png',imageData,function(err,image){
				should.not.exist(err);
				image.md5.should.equal('fe11eb600825dea10b1839ecfb55d258');
	      		dao.imageModel.getCount(function(err,count){
	      			count.should.equal(3);
	      			done();
	      		});
			});
    	});
	});

	describe('#get image from database', function() {
		it('get image3.png data from database and recalculate MD5', function(done) {
	      	dao.imageModel.findImage({md5:'fe11eb600825dea10b1839ecfb55d258'},function(err,image){
	      		should.not.exist(err);
	      		image.md5.should.equal('fe11eb600825dea10b1839ecfb55d258');
	      		var content = new BSON.deserialize(image.content.buffer);
	      		var imagedata = content.bindata.buffer;
	      		imagedata.should.not.equal(null);
	      		console.log('get image attribute and conform MD5...')

	      		var md5 = crypto.createHash('md5');
				md5.update(imagedata);
				var md5str = md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99
				md5str.should.equal(image.md5);
				console.log('get imagedata and recalculate MD5...')
	      		done();
	      	});
    	});
	});
  
});

describe('#close mongoDAO', function() {
	it('close connect', function(done) {
	  	dao.finish();
	  	done();
	});
});
	





