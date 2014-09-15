var async = require('async');
var dao = require('./mongoDAO');
var assert = require('assert');
var should = require('should');



describe('Mongodb unit test', function() {
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
	});
  
});
	





