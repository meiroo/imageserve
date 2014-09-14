var async = require('async');
var mongodb = require('mongodb');
var fs = require('fs');
var dao = require('./mongoDAO');
var BSON = mongodb.BSON;




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
			var content = new BSON.serialize({bindata:imageData});

			dao.insertImage('md5xxxxxxxx','jpg',content,callback);

			var des = new BSON.deserialize(content);
			console.log(des);
		}
	],

	function(err,results){
		if(err)
			console.log("Nooooooo! "+ err);
		

		dao.findImage({_id:mongodb.ObjectID('5415a3d36021ab942ca20df0')},function(err,doc){
			var content = new BSON.deserialize(doc.content.buffer);
			console.log(content);
			fs.writeFileSync('test.jpg', content.bindata.buffer,"binary");
			console.log("all test success...");

		});

		dao.findImage({type:'jpg'},function(err,doc){
			//console.log(doc);
		});

	}
);