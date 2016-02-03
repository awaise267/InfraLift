var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	
	var connection = mysql.createConnection({
	    host     : '127.0.0.1',
	    user     : 'root',
	    password : 'root',
	    database : 'infra',
	    port	 : 3306
	});
	return connection;
	/*
	if (process.env.VCAP_SERVICES) {
	  var services = JSON.parse(process.env.VCAP_SERVICES);

	  // look for a service starting with 'mysql'
	  for (var svcName in services) {
	    if (svcName.match(/^mysql/)) {
	      var mysqlCreds = services[svcName][0]['credentials'];
	      var connection = mysql.createConnection({
	        host: mysqlCreds.host,
	        port: mysqlCreds.port,
	        user: mysqlCreds.user,
	        password: mysqlCreds.password,
	        database: mysqlCreds.name
	      });
	      return connection;
	    }
	  }
	}*/
}

function executeQuery(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			callback(err, rows);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	

function insertData(sqlQuery,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, results, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+results);
			callback(err, results);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	

exports.insertData=insertData;

exports.executeQuery=executeQuery;