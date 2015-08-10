define(function(require, exports, module) {
    //Put traditional CommonJS module content here
    var api = require('api');
    var angular = require('angular');

    
	var controller = function($scope,Data){
		$scope.Data = Data;
    	var vm = $scope;
		vm.item = null;
		vm.jqobj = $('#model-rmfolder');

		vm.show = function(item){
			vm.item = item;
			vm.jqobj.modal('show');
		}

		vm.hide = function(){
			vm.jqobj.modal('hide');
		}

		vm.confirm = function(event,item){
			vm.hide();
			if(item.type=='folder'){
				api.deleteFolder(item.url,function(data){
					$scope.$apply(function(){
						Data.forceRefresh();
					});
				});
	  		}else{
	  			api.deleteImage(item.url,function(data){
					$scope.$apply(function(){
						Data.forceRefresh();
					});
				});
	  		}
		}

		$scope.$watchCollection('Data.itemdelete', function() {
			if(Data.itemdelete){
				vm.show(Data.itemdelete);
			}else{
				vm.hide();
			}
	    });

		
	};

	module.exports = controller;
});