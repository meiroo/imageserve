define(function(require, exports, module) {
	var plugins = {};	

	//color box...
	

	//dropzone ...
	Dropzone.options.myAwesomeDropzone = {
	    paramName: "file", // The name that will be used to transfer the file
	    maxFilesize: 10, // MB

		addRemoveLinks : true,
		dictDefaultMessage :
		'<span class="bigger-150 bolder"><i class="ace-icon fa fa-caret-right red"></i> Drop files</span> to upload \
		<span class="smaller-80 grey">(or click)</span> <br /> \
		<i class="upload-icon ace-icon fa fa-cloud-upload blue fa-3x"></i>',
		dictResponseError: 'Error while uploading file!',
		acceptedFiles:'image/*',
		
		//change the previewTemplate to use Bootstrap progress bars
		previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
	};

	plugins.initDropzone = function(url,callback){
		try {
			var myDropzone = new Dropzone("#dropzone",Dropzone.options.myAwesomeDropzone);
			myDropzone.on("sending", function(file, xhr, formData) {
	  			//alert('sending..')
	  			var current_url = url;
	  			formData.append("parenturl",current_url);
	  			formData.append("filesize", file.size); // Will send the filesize along with the file as POST data.

			});
			myDropzone.on("success", function(file, response) {
	  			//alert('complete..')
	  			console.log(response);
	  			myDropzone.removeFile(file);
	  			callback();
	  			//window.location.reload(true);	
			});
			myDropzone.on("error", function(file, errmsg) {
	  			//alert('complete..')
	  			console.log(errmsg);
	  			callback();
			});

		} catch(e) {
			alert(e);
		}

	}

	plugins.initColorbox = function(){
		var $overflow = '';
		plugins.colorbox_params = {
			rel: 'colorbox',
			reposition:true,
			scalePhotos:true,
			scrolling:true,
			previous:'<i class="ace-icon fa fa-arrow-left"></i>',
			next:'<i class="ace-icon fa fa-arrow-right"></i>',
			close:'&times;',
			current:'{current} of {total}',
			maxWidth:'100%',
			maxHeight:'100%',
			onOpen:function(){
				$overflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			},
			onClosed:function(){
				document.body.style.overflow = $overflow;
			},
			onComplete:function(){
				$.colorbox.resize();
			}
		};
		$(".cboxElement").colorbox(plugins.colorbox_params);
	}

	

	module.exports = plugins;
	
});


