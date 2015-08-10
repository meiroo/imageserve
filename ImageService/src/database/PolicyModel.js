var path = require('path');
var mongodb = require('mongodb');
var BSON = mongodb.BSON;
var async = require('async');

function PolicyModel(d){
	var dao = d;

	this.vertifyPolicy = function(policy){
		if(!policy.name)
			return 'policy string should contain name!';
		if(!policy.content)
			return 'policy string should contain content!';
		if( Object.prototype.toString.call(policy.content) !== '[object Array]')
			return 'policy content should be array!';
		if(!policy.content[0])
			return 'policy content should contain at least one element!';
		for(var item in policy.content){
			if(!policy.content[item].type)
				return 'policy content element should contain type value!';
		}
		return null;
	}

	this.findPolicy = function(query,callback){
		dao.policyCollection.findOne(query, callback);
	}

	this.insertPolicy = function(policy,callback){
		console.log('insert policy..');
		var err = dao.policyModel.vertifyPolicy(policy);
		if(err){
			console.error('ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR:\n'+err);
			callback(err,null);return;
		}
		var ObjectID = mongodb.ObjectID;
		policy._id = new ObjectID();
		dao.policyModel.findPolicy({name:policy.name},function(err,result){
			if(result){

				//!!!!!!!!!!!!!!!!!!!!!!!!!!! need update
				//callback('Policy with name '+policy.name+' already exist!',result);
				//callback('Already has policy:'+ policy.name,result);
				console.log('Already has policy:'+ policy.name + ' Need Update!');
				result.content = policy.content;
				console.log('remove policy '+ policy.name + ' images...');

				dao.pathCollection.remove({policy:policy.name},function(err){
					if(err){
						callback('remove policy '+ policy.name + ' images error!',null);
						return;
					}
					dao.policyCollection.update({_id:result._id}, result, {}, function(err,result){
						if(err){
							callback('update policy error : ' +err);return;
						}
						dao.policyModel.findPolicy({name:policy.name},callback);
					});
				});
				
			}else{
				console.log('Policy insert : '+JSON.stringify(policy));
				dao.policyCollection.insert(policy,{safe:true},function(err,result){
					console.log('insert policy oid = '+policy._id);
					dao.policyModel.findPolicy({'_id':policy._id},callback);
				});	
			}
		});
		
	}

	this.removeAllPolicy = function(callback){
		dao.policyCollection.remove(callback);
	}

	this.getCount = function(callback){
		return dao.policyCollection.count(callback);
	}
}

module.exports = PolicyModel;