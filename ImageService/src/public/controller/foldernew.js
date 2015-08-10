define(function(require, exports, module) {
    //Put traditional CommonJS module content here
    var api = require('api');
    var angular = require('angular');

    var controller = function($scope,Data){
    	$scope.Data = Data;
    	var vm = $scope;
    	vm.item = null;
		vm.jqobj = $('#model-newfolder');
		vm.input = '';
		vm.show = function(item){
			vm.item = item;
			vm.jqobj.modal('show');
		}
		vm.submit = function(event,input){
			var current_url = Data.url;
			api.uploadFolder(current_url,vm.foldername,function(data){
				$scope.$apply(function(){
					vm.input = '';
					vm.hide();
					Data.forceRefresh();
				});
			});
		}

		vm.hide = function(){
			vm.jqobj.modal('hide');
		}
    };




	module.exports = controller;
});