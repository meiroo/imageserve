define(function(require, exports, module) {
	var index_api = {};

	index_api.insertPolicy = function(name,content,successcb){
		$('#main-container').spin(); 
		//alert(content);
		$.ajax({
			url: '/api/upload/policy',
			type: 'POST',
			dataType: 'json',
			data: {name: name,content:content},
			complete: function(xhr, textStatus) {
			    $('#main-container').spin(false); 
			},		
			success: function(data, textStatus, xhr) {
				//called when successful
				console.log("success");
				successcb(data);
			},
			error: function(xhr, textStatus, errorThrown) {
			    //called when there is an error
			    console.error(xhr.responseText);
			}
		});
		
	}


	index_api.uploadFolder = function(current_url,foldername,successcb){
		$('#main-container').spin(); 
		$.ajax({
			url: '/api/upload/folder',
			type: 'POST',
			dataType: 'json',
			data: {url: foldername,parenturl:current_url},	
			complete: function(xhr, textStatus) {
			    $('#main-container').spin(false); 
			},		
			success: function(data, textStatus, xhr) {
				//called when successful
				console.log("success");
				successcb(data);
			},
			error: function(xhr, textStatus, errorThrown) {
			    //called when there is an error
			    console.error(xhr.responseText);
			}
		});
	}

	index_api.getFolderItem = function(url,successcb){
		
		$('#main-container').spin(); 
		$.ajax({
		  url: '/api/path/folder',
		  type: 'GET',
		  dataType: 'json',
		  data: {url: url},
		  complete: function(xhr, textStatus) {
		    $('#main-container').spin(false); 
		  },
		  success: function(data, textStatus, xhr) {
		    successcb(data);
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    console.error(xhr.responseText);
		  }
		});
	}

	index_api.deleteFolder = function(url,successcb,errorcb){
		$('#main-container').spin(); 
		$.ajax({
		  url: '/api/remove/folder',
		  type: 'DELETE',
		  dataType: 'json',
		  data: {url: url},
		  complete: function(xhr, textStatus) {
		    $('#main-container').spin(false); 
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    successcb();
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    console.error(xhr.responseText);
		  }
		});
	}

	index_api.deleteImage=function(url,successcb){
		$('#main-container').spin();
		$.ajax({
		  url: '/api/remove/image',
		  type: 'DELETE',
		  dataType: 'json',
		  data: {url: url},
		  complete: function(xhr, textStatus) {
		    //called when complete
		    $('#main-container').spin(false); 
		  },
		  success: function(data, textStatus, xhr) {
		    //called when successful
		    successcb();
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		    console.error(xhr.responseText);
		  }
		});
	}
	module.exports = index_api;
});


