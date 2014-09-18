$(document).ready(function($) {

	var current_url = '/';

	function showSingleItem(item,data){
    	  	var li = $('<li></li>');
    	  	li.html(data);
    	  	if(item.type == 'folder'){
    	  		li.find("a img").attr("src","images/gallery/folder.png");
    	  		li.find(".url").removeClass('cboxElement');
    	  		li.find(".url").addClass('folder');
    	  		//li.data('rel')='';
    	  	}else{
    	  		//
    	  		//
    	  		li.find(".url").addClass('folderItem');
    	  		li.find("a img").attr("src","/getpath/image"+"?url="+encodeURIComponent(item.url));
    	  		li.find(".url").attr('href',"/getpath/image"+"?url="+encodeURIComponent(item.url));
    	  	}
    	  	//li.find(".url").attr('href',item.url);
    	  	li.find("a .text .inner").text(item.url);
    	  	  
    	  	$(".page-content-area ul").append(li);
    	  	$(".cboxElement").colorbox({ rel: 'colorbox' });

    	  	li.on('click',".folder",function(event){
    	  		event.preventDefault();
    	  		showItemsFromFolder(item.url);
    	  		return true;
    	  	});
	}

	function showItemsFromFolder(url){
		$.ajax({
		  url: '/getpath/folder',
		  type: 'GET',
		  dataType: 'json',
		  data: {url: url},
		  complete: function(xhr, textStatus) {
		    //called when complete
		  },
		  success: function(data, textStatus, xhr) {
		    $(".page-header h1 small").text(url);
		    current_url = url;
		    $.get('/template/image-ul-li.html', null, function(htmldata, textStatus, xhr) {
		    	$(".page-content-area ul").empty();
		    	$.each(data.items, function(index,item) {		    	
		    		showSingleItem(item,htmldata);	
		    	});
			});
		  },
		  error: function(xhr, textStatus, errorThrown) {
		    //called when there is an error
		  }
		});
	}

	showItemsFromFolder('/');

	$(".fa-level-up-button").on('click',function(event){
		if(current_url!='/'){
			var index = current_url.lastIndexOf('/');
			current_url = current_url.substring(0,index);
			//alert(current_url);
			showItemsFromFolder(current_url);
		}		
	});



	
	
	
	Dropzone.autoDiscover = false;
	try {
	  var myDropzone = new Dropzone("#dropzone" , {
	    paramName: "file", // The name that will be used to transfer the file
	    maxFilesize: 10, // MB

		addRemoveLinks : true,
		dictDefaultMessage :
		'<span class="bigger-150 bolder"><i class="ace-icon fa fa-caret-right red"></i> Drop files</span> to upload \
		<span class="smaller-80 grey">(or click)</span> <br /> \
		<i class="upload-icon ace-icon fa fa-cloud-upload blue fa-3x"></i>'
	,
		dictResponseError: 'Error while uploading file!',
		
		//change the previewTemplate to use Bootstrap progress bars
		previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
	  });

		//myDropzone.on("addedfile", function(file) {
   		//	$("#dropzone").dropzone({ url: '/file-upload?'+ });
		//});

		myDropzone.on("sending", function(file, xhr, formData) {
  			//alert('sending..')
  			formData.append("parenturl",current_url);
  			formData.append("filesize", file.size); // Will send the filesize along with the file as POST data.

		});

		myDropzone.on("complete", function(file, xhr, formData) {
  			//alert('complete..')
  			showItemsFromFolder(current_url);
  			
		});

	} catch(e) {
	  alert('Dropzone.js does not support older browsers!');
	}

});