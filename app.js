var express = require('express');
var fs = require('fs');
var exec = require('child_process').exec;
var mysql = require('mysql');
var util = require('util');

//Create an mysql database connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'nodeexercise',
  port     : 8889
});

var app = express.createServer();

app.configure(function(){
   	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('view options', {layout: false});
    app.use(express.bodyParser({keepExtensions: true,uploadDir:'./uploads'}));
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
    app.enable("jsonp callback");
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    app.use(express.logger({ format: ':method :url' }));
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});


app.error(function(err, req, res, next){
	res.render('500.ejs', { locals: { error: err },status: 500 });	
});


//Default route
//Gets the list of uploaded files
app.get("/", function(req,res){
	var sql = 'SELECT * FROM uploadedfiles order by fileid desc';
	connection.query(sql, function(err, results) {
  		res.render('main.ejs', {results:results});	
	});	
});

//Uploads the file and updates the database with
//the statistics from the uploaded file
app.post("/upload", function(req, res, next) {
    var file = req.files.file;
	var uploadedFileName = file.path.substr(file.path.indexOf("/")+1, file.path.length); 
	
	
	exec('wc '+file.path, function (error, results) { 	
    	var truncatedResults = results.replace(/\s+/g,":");
    	var n = truncatedResults.split(':');
    	var lines = parseInt(n[1])+1;
    	var words = parseInt(n[2]);
  
    	getFirstFewWords(file.path,5, function(returnValue) {
  			if(returnValue)
  				var fileData = {filename:file.name, uploadedfilename:uploadedFileName, wordcount:words, linecount:lines, filetext:returnValue};
  			else
  				var fileData = {filename:file.name, uploadedfilename:uploadedFileName, wordcount:words, linecount:lines};
  			
  			var query = connection.query('INSERT INTO uploadedfiles SET ?', fileData, function(err, result) {
  				if (err) throw err;
  				
  				var insertId = result.insertId;
  				res.contentType('application/json');
    			res.send({name:file.name, insertId:insertId, wordcount:words, linecount:lines, text:returnValue});
    			res.end();
			});
		
		});
    	
	});
   
});

//Route for displaying the file data
app.get("/browse/:fileId", function(req, res, next){
	var fileId = parseInt(req.params.fileId);
	var sql    = 'SELECT * FROM uploadedfiles WHERE fileid = ' + connection.escape(fileId);
	connection.query(sql, function(err, results) {
		if(results.length>0 && results.length==1){
  			res.render('browse.ejs',{results:results});
  		}
  		else{
  			res.redirect('/404');
  		}
	});
});

//Call to get the file data from the server
app.get("/getFile", function(req, res){
	var fileName = req.query.fileName;
	var uploadedfilename = __dirname + "/uploads/" + fileName;
	
	res.writeHead(200, {
    	'Content-Type': 'text/plain'
  	});
	var readStream = fs.createReadStream(uploadedfilename);
	util.pump(readStream, res);
});

//404 
app.get("/404", function(req,res,next){
	res.render('404.ejs');
});

app.get("/*", function(req,res,next){
	res.render('404.ejs');
});

app.listen(3030);



//Returns a string with the specified wordCount
//@filePath: The file path from which the word has to be read
//@wordCount: The number of words to be read
//callback: Function to return the response
function getFirstFewWords(filePath,wordCount, callback){
	var i,count=0;
	var string="";
	var word="";
	
	//Create a stream to read the specified file
	var stream = fs.createReadStream(filePath);
	
	//On stream event 'data'
  	stream.on('data', function(chunk) {
    	//Check if the count matches the given Word Count
    	if(count<wordCount){
    		for (i=0; i < chunk.length; ++i){
      			if (chunk[i] == 32|| chunk[i]==10){
      				word=word.trim();
      				if(word){
      					string = string + word + " ";
      					word = "";
      					count++;
      					if(count==wordCount)
      						break;
      				}
      				
      			}else{
      				word = word + String.fromCharCode(chunk[i]);
      			} 
      		}
      	}else{
      		//Once the word count is reach destroy the stream
      		stream.destroy();
      	}
  	});
  	stream.on('end', function() {
    	stream.destroy();
  	});
  	stream.on('close', function(){
  		callback(string);
  	});
  	stream.on('error', function(){
  		callback(string);
  	})
}



