define(function(require, exports, module) {
    //Put traditional CommonJS module content here
    var api = require('api');
    var angular = require('angular');

    var model = angular.define("PolicyDlg",function(vm){
		vm.item = null;
		vm.input1 = '';
		vm.input2 = '';
		vm.jqobj = $('#model-policy');
		vm.img1src = '';
		vm.img1href = '';
		vm.img2src = '';
		vm.img2href = '';

		vm.init = function(item){
			var s1 = $("#policy1");
			s1.val('');	s1.select2();
			var s2 = $("#policy2");
			s2.val(''); s2.select2();
			s1.on('change', function(event){
		  		//alert(event.val);
		  		s2.select2('val','');
		  		console.log(s1.select2('data'));
		  		vm.change(s1,item,event);
		  	});

		  	s2.on('change', function(event){
		  		//alert(event.val);
		  		s1.select2('val','');
		  		console.log(s2.select2('data'));
		  		vm.change(s2,item,event);
		  	});


			vm.img1src = "/imgapi/"+encodeURIComponent(item.url);
			vm.img1href = "/imgapi/"+encodeURIComponent(item.url);
			vm.img2src = "/images/noimage.jpg";
			vm.img2href = "/images/noimage.jpg";

			vm.input1 = '';
			vm.input2 = '';
		}

		vm.show = function(item){
			vm.init(item);
			vm.item = item;		
			vm.jqobj.modal('show');
			$("select").select2();
		}
		vm.hide = function(){
			vm.jqobj.modal('hide');
		}

		vm.makePolicy = function(multiple,items){
			var policy = {};	
			if(multiple){
				policy.tobeinsert = true;
				policy.name = 'tmppolicy';
				policy.content = [];
				for(var i in items){
					var ops = items[i].id;
					var opstr= '{"type":' + ops + '}';
					console.log('policy option str: '+ opstr);
					var c = $.parseJSON(opstr);
					policy.content.push(c);
				}
				
				console.log('policy:\n'+$.toJSON(policy));
				
			}else{
				policy.tobeinsert = false;
				policy.name = items.id;
				console.log('policy:\n'+$.toJSON(policy));
			}
			return policy;
		}

		vm.change = function(select,item,evt){
			var multiple = select.attr('multiple');	
		    var items = select.select2('data');
		    if(items.length === 0){	    	
		    	return;
		    }
		    var policy = vm.makePolicy(multiple,items);
		    var name = policy.name;
		    var content = policy.content;
		    if(policy.tobeinsert){
		    	api.insertPolicy(name,$.toJSON(content),function(data){
		   	 		vm.img2src = "/imgapi/"+encodeURIComponent(item.url) + '?policy='+name + '&random='+Math.random();
					vm.img2href = "/imgapi/"+encodeURIComponent(item.url) + '?policy='+name+ '&random='+Math.random();
		    	});
		    }else{
		    	vm.img2src = "/imgapi/"+encodeURIComponent(item.url) + '?policy='+name;
				vm.img2href = "/imgapi/"+encodeURIComponent(item.url) + '?policy='+name;
		    }
		}
	});
	module.exports = model;
});


