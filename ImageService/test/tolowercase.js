var async = require('async');
var MongoDAO = require('../src/database/mongoDAO');
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;

var dao = new MongoDAO();

describe('#mongoDAO close', function() {
	describe('#init mongoDAO', function() {
		it('error:get collection without connect', function(done) {
	      	dao.init(function(err,result){
	      		should.not.exist(err);
	      		dao.pathModel.findAllPath(/.*/,null,function(err,arrays){
		      		should.not.exist(err);
		      		//console.log(path);
		      		should.exist(arrays);
		      		
		      		async.each(arrays, function(item, callback) {
							//console.log('processing path :' + item.url);

						
						var newurl = item.url.toLowerCase();
						console.log(item.url+' renaming to :'+newurl);
						item.url = newurl;

						dao.pathCollection.update({_id:item._id}, item, {}, callback);
						
					},function(err){
						should.not.exist(err);
						done();
					});						   		
		      	});
	      	});
   	 	});
 	});

});