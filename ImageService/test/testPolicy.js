var async = require('async');
var MongoDAO = require('../src/database/mongoDAO');
var policyManager = require('../src/components/PolicyManager');
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;

var dao = new MongoDAO();

describe('Policy: init database', function() {
	describe('#init mongoDAO', function() {
		it('error:get collection without connect', function(done) {
	      	dao.init(function(err,result){
	      		should.not.exist(err);
	      		done();
	      	});
   	 	});
 	});

 	describe('#clear policy ', function() {
		it('clear policy', function(done) {
	      	dao.policyModel.removeAllPolicy(function(err,rmcount){
	      		console.log(rmcount);
	      		dao.policyModel.getCount(function(err,count){
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

describe('#policy insert', function() {
	it('insert normal one', function(done) {
		var policy = {
			name:"testpolicy1",
			content:[
				{type:"resize",width:300,height:300}
			]	
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.not.exist(err);
	  		console.log(result);
	  		done();
	  	});
	  	
	});

	it('insert normal one duplicated', function(done) {
		var policy = {
			name:"testpolicy1",
			content:[
				{type:"resize",width:400,height:300}
			]	
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		//!!!!!!!!!!!!!!!!!!!!!!
	  		should.not.exist(err);
	  		console.log(result);
	  		result.name.should.equal(policy.name);
	  		result.content[0].width.should.equal(400);
	  		
	  		done();
	  	});
	  	
	});

	it('insert normal two', function(done) {
		var policy = {
			name:"testpolicy2",
			content:[
				{type:"resize",width:300,height:300},
				{type:"watermark",width:300,height:300}
			]	
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.not.exist(err);
	  		console.log(result);
	  		done();
	  	});
	  	
	});

	it('insert misformat one without name', function(done) {
		var policy = {
			content:[
				{type:"resize",width:300,height:300}
			]	
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.exist(err);
	  		console.log(err);
	  		done();
	  	});
	  	
	});

	it('insert misformat one without content', function(done) {
		var policy = {
			name:'policy3',
			content:null
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.exist(err);
	  		console.log(err);
	  		done();
	  	});
	  	
	});

	it('insert misformat one: content should be array', function(done) {
		var policy = {
			name:"testpolicy1",
			content:'policys sdfs'
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.exist(err);
	  		console.log(err);
	  		done();
	  	});
	  	
	});

	it('insert misformat one: content should hava element', function(done) {
		var policy = {
			name:"testpolicy1",
			content:[
				
			]	
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.exist(err);
	  		console.log(err);
	  		done();
	  	});
	  	
	});

	it('insert misformat one:content should contain type', function(done) {
		var policy = {
			name:"testpolicy1",
			content:[
				{width:300,height:300}
			]	
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.exist(err);
	  		console.log(err);
	  		done();
	  	});
	  	
	});

	it('insert misformat one:content should contain type', function(done) {
		var policy = {
			name:"testpolicy1",
			content:[
				{type:'resize',width:300,height:300},
				{type:'resize',width:300,height:300},
				{type:'resize',width:300,height:300},
				{width:300,height:300}
			]	
		}
	  	dao.policyModel.insertPolicy(policy,function(err,result){
	  		should.exist(err);
	  		console.log(err);
	  		done();
	  	});
	  	
	});
});



describe('#policy mongoDAO close', function() {
	it('generate policy image', function(done) {
	  	//policyManager. getPolicyImage
	  	var imageData2 = fs.readFileSync('./image/image.jpg');
	  	dao.pathModel.addPathImage('/','image.jpg',null,'image/gif',null,imageData2,function(err,result){
	  		should.not.exist(err);
	  		policyManager.getPolicyImage(dao,'/image.jpg','thumbnail',function(err,result){
	  			should.not.exist(err);
	  			should.exist(result);
	  			console.log(result);
	  			done();
	  		});
	  	});
	});

	it('when delete image: also delete policy image', function(done) {
	  	//policyManager. getPolicyImage
	  	dao.pathModel.removePathImage('/image.jpg',function(err,rmpath){
	  		should.not.exist(err);
	  		rmpath.url.should.equal('/image.jpg');
	  		dao.pathModel.findPath('/image.jpg',null,function(err,result){
	  			should.not.exist(err);
	  			should.not.exist(result);
	  			dao.pathModel.findPath('/image.jpg','thumbnail',function(err,result){
	  				should.not.exist(err);
	  				should.not.exist(result);
	  				done();
	  			});

	  		});
	  	});
	});

	it('generate policy image', function(done) {
	  	//policyManager. getPolicyImage
	  	var imageData2 = fs.readFileSync('./image/image.jpg');
	  	dao.pathModel.addPathImage('/','image.jpg',null,'image/gif',null,imageData2,function(err,result){
	  		should.not.exist(err);
	  		policyManager.getPolicyImage(dao,'/image.jpg','thumbnail',function(err,result){
	  			should.not.exist(err);
	  			should.exist(result);
	  			policyManager.getPolicyImage(dao,'/image.jpg','template',function(err,result){
		  			should.not.exist(err);
		  			should.exist(result);
		  			done();
		  		});
	  		});
	  	});
	});

	it('generate policy image3', function(done) {
	  	//policyManager. getPolicyImage
	  	var imageData2 = fs.readFileSync('./image/image5.jpg');
	  	dao.pathModel.addPathImage('/','image5.jpg',null,'image/gif',null,imageData2,function(err,result){
	  		should.not.exist(err);
	  		policyManager.getPolicyImage(dao,'/image5.jpg','thumbnail',function(err,result){
	  			should.not.exist(err);
	  			should.exist(result);
	  			policyManager.getPolicyImage(dao,'/image5.jpg','template',function(err,result){
		  			should.not.exist(err);
		  			should.exist(result);
		  			done();
		  		});
	  		});
	  	});
	});

	it('overwrite image.. should remove older policy image', function(done) {
	  	//policyManager. getPolicyImage
	  	var imageData2 = fs.readFileSync('./image/image2.jpg');
	  	dao.pathModel.addPathImage('/','image.jpg',null,'image/gif',null,imageData2,function(err,result){
	  		should.not.exist(err);
	  		dao.pathModel.findPath('/image.jpg','thumbnail',function(err,result){
  				should.not.exist(err);
  				should.not.exist(result);
  				dao.pathModel.findPath('/image.jpg','template',function(err,result){
	  				should.not.exist(err);
	  				should.not.exist(result);
	  				dao.pathModel.findPath('/image5.jpg','template',function(err,result){
		  				should.not.exist(err);
		  				should.exist(result);
		  				done();
		  			});
	  			});
  			});
	  	});
	});


});


describe('remove path with policy process', function() {
	it('close connect', function(done) {
	  	dao.finish();
	  	done();
	});
});