file_upload
===========
file_upload is a simple file uploader application that allows to upload multiple **text** files to server. Once the files are uploaded it is added to the uploaded file list with the word count, line count and first 5 words in the file. The application uses "Express" framework for node.js and EJS for rendering views. The database for the application uses mysql. The application supports the following functionality:

1. Allows you to upload a text file through the browser
2. Shows you a visual indication of upload progress.    
3. After the file is uploaded, the file is added to the uploaded file list that shows
	*Number of lines in the file
	*Number of words in the file
	*Top 5 words in the file
4. "Main" page which lists all of the files that have been uploaded so far and/or are in the process of being uploaded.
5. Linking in the browse page to bring up the view for that file.

##Pre-requisites:
* express:2.5.8
* ejs:Latest Version
* mysql: 2.0.0-alpha3
* jQuery, jQueryUI

##Configurations
The server listens on port number: 3030 once started using node app.js

##Database setup
*The application uses a mysql database 
*Import localhost.sql to the mysql database 
*Change the required parameters in app.js to match the correct host, port, username, password 
