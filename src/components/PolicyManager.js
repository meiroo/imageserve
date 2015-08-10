var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var async = require("async");
var util = require("util");


var PolicyManager = {};

PolicyManager.getPolicyImage = function(dao,url,policy,retcallback){
	
	var oriImg = null;
	async.waterfall(
		[
			function(callback){
				console.log('findImagePathContent policy='+policy);
				dao.pathModel.findImagePathContent(url,policy,callback);
			},
			function(img,callback){
				if(img){
					console.log('findImagePathContent find img!');
					retcallback(null,img);return;
				}else{
					dao.pathModel.findImagePathContent(url,null,callback);
				}
			},
			function(img,callback){			
				if(!img){
					callback("No such image for processing...",null);
				}else{
					console.log('Need to process policy(' + policy + ') for url: '+ url );
					oriImg = img;
					PolicyManager.ProcessPolicy(dao,img,policy,callback);
				}
			},
			function(policybuffer,callback){
				dao.pathModel.addPathImage('/',url,null,oriImg.stype,policy,policybuffer,callback);
			},
			function(path,callback){
				dao.pathModel.findImagePathContent(url,policy,callback);
			}
		],
		function(err,result){
			//console.log('PolicyManager error:' + err);
			retcallback(err,result);
		}
	);
}

//test:
//
PolicyManager.ProcessPolicy = function(dao,img,policyname,retcallback){
	dao.policyModel.findPolicy({name:policyname},function(err,policy){
		if(err){
			retcallback(err,null);return;
		}else if(policy){
			var name = policy.name;
			var content = policy.content;

			var process = [];
			process.push(function(callback){
						callback(null,img.imagedata);
					});

			content.forEach(function(options) {
				if(options.type === 'thumbnail'){
					process.push(function(imagedata,callback){
						PolicyManager.ProcessThumbnail(imagedata,options,callback);
					});					
				}else if(options.type === 'watermark'){
					process.push(function(imagedata,callback){
						PolicyManager.ProcessWatermark(imagedata,options,callback);
					});	
				}
				else{
					retcallback("policy type is not in (thumbnail)",null);
					return;
				}
			});			
			async.waterfall(
				process,
				function(err,result){
					retcallback(err,result);
				}
			);				
		}else{
			retcallback("No such policy...",null);
		}
	});
}

PolicyManager.ProcessThumbnail = function(img,userOptions,callback){
	var options={
		size:150
	};
	util._extend(options,userOptions);
	console.log('begin ProcessThumbnail options='+JSON.stringify(options)+'...');

	gm(img,'img.jpg')
		.resize(options.size, options.size)
		.autoOrient()
		.toBuffer('png',function (err, buffer) {
		  if (err){
		  	console.log('gm process error:'+err);
		  	callback(err,null);
		  }else{
		  	console.log('gm to buffer...');
		  	callback(null,buffer);
		  }		  
		})
}



PolicyManager.ProcessWatermark = function(img,userOptions,callback){
	var options={
		fontSize:100,
		color:"#555555DD",
		font:"public/fonts/fzytk.ttf",
		startx:'0',
		starty:'0',
		rotate:0,
		text:'WaterMark...',
		gravity:'East'
	};
	gm(img,'jpg').size(function(err, value){
		console.log("LLLLLLLLLLL"+ JSON.stringify(value));
		if(value){
			options.fontSize = value.width/5;
		//	console.log('value2value2value2value2value2');
		//	console.log('value2:'+value.match(/^([0-9.]+)x[0-9.]+/));
		}

		util._extend(options,userOptions);
		console.log('begin ProcessWatermark options='+JSON.stringify(options)+'...');
		
		console.log('gm command:'+'rotate '+options.rotate +' gravity '+options.gravity+ ' text ' +options.startx+','+ options.starty + '"' + options.text+'"');

			
		gm(img,'img.jpg')
		.fontSize(options.fontSize)
		.fill(options.color)
		.font(options.font)
		//.draw('rotate 0.0 gravity East  text 0,0 "dsfsd" ')
		.draw('rotate '+options.rotate +' gravity '+options.gravity+ ' text ' +options.startx+','+ options.starty + '"' + options.text+'"')
		//.drawText(options.startx, options.starty, options.text,options.gravity)
		.toBuffer('png',function (err, buffer) {
			if (err){
				console.log('gm process error:'+err);
				callback(err,null);
			}else{
				console.log('gm to buffer...');
			  	callback(null,buffer);
			}		  
		})
	})

	
}

module.exports = PolicyManager;