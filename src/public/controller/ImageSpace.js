define(function(require, exports, module) {
	
	var api = require('api');
	var angular = require('angular');
	var plugin = require('plugins');
	//var RmfolderController = require('folderrm');
    //var RMFolderDlg = require('controller/folderDlg').RMFolderDlg;
    //var PolicyDlg = require('controller/PolicyDlg');


	var controller = function($scope,Data,$routeParams,$location){
		$scope.Data = Data;
		var vm = $scope;
		console.log('imagespace:'+ $routeParams.pathName);
		if($routeParams && $routeParams.pathName)
			Data.setURL('/'+$routeParams.pathName);
		else
			Data.setURL('/');

		vm.array=[];  

		vm.show = function(url){
			 if(!url)
			 	url = Data.url;
			api.getFolderItem(url,function(data){

				$scope.$apply(function(){
					//global_op.setURL(url);
					vm.array=[];
					for(var index in data){
						var item = data[index];
						item.href = '#';
			    		item.togglePolicy = false;
			    		item.click = null;
			    		item.clickPolicy = null;
			    		item.toggleCBox = false;

			    	  	if(item.type === 'folder'){
			    	  		item.imgsrc = "images/gallery/folder.png";
			    	  		item.click = vm.onFolderClick;
			    	  		item.toggleCBox = false; 
			    	  	}else{
			    	  		item.imgsrc = "/imgapi/"+encodeURIComponent(item.url) + '?policy=thumbnail';
			    	  		item.href = "/imgapi/"+encodeURIComponent(item.url);
			    	  		item.togglePolicy = true;
			    	  		item.clickPolicy = vm.onPolicy; 
			    	  		item.toggleCBox = true; 
			    	  		item.click = vm.onImgClick;	
			    	  	}
			    	  	
			    	  	item.clickDelete = vm.onItemDelete;
			    	  	vm.array.push(item);
					}

					//vm.array=data;
					//alert($("ul .cboxElement").length);
					//$(".cboxElement").colorbox(plugins.colorbox_params);
				});
				
		    });
		}

		vm.onUploadClick = function(event){
			plugin.initDropzone(Data.url,vm.show);
			event.preventDefault();
	  		return true;
		}

		vm.onFolderClick = function(event,item){
			event.preventDefault();
			$location.path(item.url);
	  		//Data.setURL(item.url);
	  		return true;
		}

		vm.onImgClick = function(event,item){
			event.preventDefault();
			plugin.initColorbox();
	  		return true;
		}

		vm.onItemDelete = function(event,item){
			event.preventDefault();
			Data.setItemDelete(item);
			return true;
		}

		vm.onPolicy = function(event,item){
			//PolicyDlg.show(item);
		}

		$scope.$watchCollection('Data.url', function() {
			vm.show(Data.url);
	    });

	    $scope.$watchCollection('Data.refresh', function() {
			vm.show(Data.url);
	    });



	 //    $scope.$on('ngRepeatFinished'， function (ngRepeatFinishedEvent) {
  //         //下面是在table render完成后执行的js
  //         var plugins = require('plugins');
		// });
    };
    
	module.exports = controller;

});