var ejs = require("ejs");
var mysql = require('./mysql');
var fs = require('fs');
var https = require("https");
var http = require('http');


exports.uploadImage = function(req, res){
	
	var NameInfra = req.param("txt_name");
	var Address = req.param("txt_address");
	var Zipcode = req.param("txt_zip");
	var Country = "US";
	var State = req.param("txt_state");
	var Description = req.param("txt_description");
	var date = "NOW()";
	var user_id = req.infralift.user.USER_ID;
	var is_active = 0;
	
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var conn = mongoose.createConnection('mongodb://localhost:27017/infralift');
    var fs = require('fs');
    //console.log(req.ubersession.user.ssn);
    var Grid = require('gridfs-stream');
    var uid = require('uid2');    
    Grid.mongo = mongoose.mongo;

    var dirname = require('path').dirname(__dirname);
    var filename = req.files.file.name;
    console.log(req.files.file.name);
    console.log(req.files.file.name.split('.'));
    var extension = req.files.file.name.split(/[. ]+/)[1];
    var targetName = req.infralift.user.USER_ID +'_' + uid(22) + '.' + extension;  
    var path = req.files.file.path;
    var type = req.files.file.mimetype;

    
    var options = {
			  host: 'maps.googleapis.com',
			  port:'443',
			  path: '/maps/api/geocode/json?components=postal_code:'+Zipcode+'|administrative_area:'+State+'|country:'+Country+'&key=AIzaSyAXDDyKswv88pTWxbkZol0EmvNZ4TqD5yw'
			};
	console.log('https://'+options.host+options.path);
	var callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
		  var flag = false;
		  if(JSON.parse(str).results[0]){
			  if(JSON.parse(str).results[0].geometry){
				  if(JSON.parse(str).results[0].geometry.location){
					  flag = true;
				  	var lat = JSON.parse(str).results[0].geometry.location.lat;
				  	var lng = JSON.parse(str).results[0].geometry.location.lng;
				  	var insertData = "INSERT INTO `request`(`NAME_OF_INFRA`,`ADDRESS`,`ZIPCODE`,`COUNTRY`,`STATE`,`DESCRIPTION`,`DATE_UPLOADED`,`USER_ID`,`IS_ACTIVE`,`LAT`,`LNG`,`IMAGEFILE`)VALUES('"+NameInfra+"','"+Address+"','"+Zipcode+"','"+Country+"','"+State+"','"+Description+"',"+date+",'"+user_id+"','"+is_active+"','"+lat+"','"+lng+"','"+targetName+"');";
				    mysql.insertData(insertData,function(err,results){
			    		if(err){
			    			throw err;
			    		}
			    		else 
			    		{                	
			                console.log(targetName + ' Written To DB');
			                res.send({"value": targetName, "result":"success"});
			    		}
					});
				  }
			  }
		  }
		  if(!flag){
			  var insertData = "INSERT INTO `request`(`NAME_OF_INFRA`,`ADDRESS`,`ZIPCODE`,`COUNTRY`,`STATE`,`DESCRIPTION`,`DATE_UPLOADED`,`USER_ID`,`IS_ACTIVE`,`LAT`,`LNG`,`IMAGEFILE`)VALUES('"+NameInfra+"','"+Address+"','"+Zipcode+"','"+Country+"','"+State+"','"+Description+"',"+date+",'"+user_id+"','"+is_active+"','"+"39.50"+"','"+"-98.35"+"','"+targetName+"');";
			    mysql.insertData(insertData,function(err,results){
		    		if(err){
		    			throw err;
		    		}
		    		else 
		    		{                	
		                console.log(targetName + ' Written To DB');
		                res.send({"value": targetName, "result":"success"});
		    		}
				});
		  }		  	
	  });
	};
    
    
    conn.once('open', function () {
        console.log('open');
        var gfs = Grid(conn.db);

        var writestream = gfs.createWriteStream({
            filename: targetName
        });
        fs.createReadStream(path).pipe(writestream);
        writestream.on('close', function (file) { 
        	https.request(options, callback).end();
        });
        
    });
};



exports.getImage = function (req, res) {
	res.set('Content-Type', 'image');
    var image = req.param('image');
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    console.log('code is here');
    var conn = mongoose.createConnection('mongodb://localhost:27017/infralift');
    var fs = require('fs');

    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

    conn.once('open', function () {
        console.log('open');
        console.log('image name ' + image);
        var gfs = Grid(conn.db);
        gfs.createReadStream({
            filename: image
        }).pipe(res);
    });
};

exports.getimg = function (req,res){
	res.render('getImage');
};

