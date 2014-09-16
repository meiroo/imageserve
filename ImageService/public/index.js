$(document).ready(function($) {
	$('#dropzone').on('click',function(event){
		//alert('click1');
	});

	$('#dropzone').on('change',function(event){
		//alert('change1');
	});

	$('#dropzone').on('submit',function(event){
		event.preventDefault();
		//alert('submit');
	});

	$('#dropzone').on('click','#dropzone-input',function(event){
		//alert('click2');
	});

	$('#dropzone').on('change','#dropzone-input',function(event){
		//alert('change2');
	});

	$('#dropzone').on('post','#dropzone-input',function(event){
		//alert('post2');
	});

	$("#dropzone").submit(function(event) {
		event.preventDefault();
		//alert('submit!!!')
    	var url = "path/to/your/script"; // the script where you handle the form input.
	    $.ajax({
	           type: "POST",
	           url: url,
	           data: $("#idForm").serialize(), // serializes the form's elements.
	           success: function(data)
	           {
	               //alert(data); // show response from the php script.
	           }
	    });
	    return false; // avoid to execute the actual submit of the form.
	});

	var frm = $('#dropzone');
    frm.submit(function (ev) {
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                //alert('ok');
            }
        });

        ev.preventDefault();
    });
});