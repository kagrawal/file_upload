var counter = 0; //Keep a count of the files uploaded


$(document).ready(function(){
	
});

//Handles the change event for input type:file
$(function() {
	$("input:file").change(function (e){
		var uri = e.target.baseURI;
        var index = uri.indexOf('#', 0);
        if (index != -1) {
        	uri = uri.slice(0, index);   
        }
        var counter_array = [];
        
        //Add the files to be uploaded in the upload list
        for(var i=0;i<e.target.files.length;i++){
        	var file = e.target.files[i];
        	var fileName = file.name;
        	var extension = file.name.substring(file.name.lastIndexOf('.')+1);
        	if(extension == "txt"){
        		var html = "<li class='clear-fix' id='file-"+counter+"'><span class='filelist-filename'>"+file.name+"</span><span class='indicator'><div id='progressbar'></div></span></li>";
        		$('#upload_filelist').append(html);
        	}
        	counter_array.push(counter);
        	counter++;
        }
        
		uploadFiles(uri + "upload", e.target.files, counter_array);
		
	});
});

//Uploads the file to the server and add the 
//uploaded files back to the main list
function uploadFiles(root, files, listid){

	function ajaxUpload(root, files, listid,i){
		
		//Check if all the files have been uploaded
		if(i == files.length)
			return;
		
		var file = files[i];
		var extension = file.name.substring(file.name.lastIndexOf('.')+1);
        
        //Check if the file is a text file
        if(extension == "txt"){
			var fd = new FormData();    
			fd.append( 'file', file);
		
			$.ajax({
  			xhr: function(){
    			var xhr = new window.XMLHttpRequest();
    			
    			//Upload progress
    			xhr.upload.addEventListener("progress", function(evt){
      				if (evt.lengthComputable) {
        				var percentComplete = evt.loaded / evt.total;
        				var value = (percentComplete*100)%100;
        				$('#file-'+listid[i]).find('.indicator').empty().append("<div id='progressbar-"+listid[i]+"'></div><script>$('#progressbar-"+listid[i]+"').progressbar({ value: "+value+" });</script>");
       				 	//Do something with upload progress
        				
      				}
    			}, false);
    
    			//Download progress
    			xhr.addEventListener("progress", function(evt){
      				if (evt.lengthComputable) {
        				var percentComplete = evt.loaded / evt.total;
        				//Do something with download progress
        				console.log(percentComplete);
      				}
    			}, false);
    			
    			return xhr;
  			},
  			
  			url: root,
  			type: 'POST',
  			data: fd,
  			processData: false,
  			contentType: false,
  			//Once the file is loaded remove the file of the uploaded list
  			//and add it to the main file list
  			success: function(data){
  				$('#file-'+listid[i]).remove();
  				
  				var html = "<li class=\"file-info\"><p class=\"file-name\"><a href='browse/" + data.insertId + "' target='_BLANK'>"+data.name+"</a><span class=\"file-text\">"+ data.text+"</span></p>" +
            			"<div class=\"supp-info\">"+
            				"<span class=\"word-count\"><span class=\"span-caption\">Words: </span>"+ data.wordcount + "</span>"+
            				"<span class=\"line-count\"><span class=\"span-caption\">Lines: </span>"+ data.linecount + "</span>" +
            			"</div></li>";
                $('#file-summary').prepend(html);
  			},
  			//Adding the loading circle before upload
  			beforeSend:function(){
  				$('#file-'+listid[i]).find('.indicator').empty().append("<img src='images/ajax-loader.gif'></img>");
  			},
  			//On complete upload the next file
  			complete:function(){
  				ajaxUpload(root, files, listid, i+1);
  			}
			});
		}else{
			ajaxUpload(root, files, listid, i+1);
		}	
	}
	ajaxUpload(root, files, listid, 0);
}