var async = require('async');
var mongodb = require('mongodb');
var fs = require('fs');
var dao = require('./mongoDAO');


async.series(
	[
		function(callback){
			dao.connect(callback);
		},
		function(callback){
			dao.createCollection(callback);
		},
		function(callback){
			var imageData = fs.readFileSync('./image.jpg');
			console.log(imageData);
			var content = new mongodb.BSON.serialize(imageData);
			dao.insertImage('md5xxxxxxxx','jpg',content,callback);
		}
	],

	function(err,results){
		if(err)
			console.log("Nooooooo! "+ err);
		

		dao.findImage({_id:mongodb.ObjectID('54158fc35a77689c23aef8b6')},function(err,doc){
			//var content = new mongodb.BSON.deserialize(doc.content.buffer);
			//console.log(doc.content);
			//fs.writeFileSync('test.jpg', content,"binary");
			console.log("all test success...");

		});

		dao.findImage({type:'jpg'},function(err,doc){
			//console.log(doc);
		});

	}
);