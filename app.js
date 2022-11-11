var express = require('express');
var app = express();
var pg = require('pg');
/*
var connectionString = 
{
  database_driver:'pgsql',
  user: 'ojsosbuiqyntyr',
  host: 'ec2-44-195-132-31.compute-1.amazonaws.com',
  database: 'depo2gk84nnenc',
  password: 'c0e4c6cbf2767995b633bb9669c1ffa0de898e70e032e284378370c99a949a03',
  port: 5432,
};
*/
var connectionString = process.env.DATABASE_URL || 'postgres://ojsosbuiqyntyr:c0e4c6cbf2767995b633bb9669c1ffa0de898e70e032e284378370c99a949a03@ec2-44-195-132-31.compute-1.amazonaws.com:5432/depo2gk84nnenc';
//var connectionString ='postgres://postgres:psadmin1@localhost:5432/balaDemo';

var bodyParser = require("body-parser");

if (process.env.DATABASE_URL !== undefined) {
  pg.defaults.ssl = true;
 // pg.defaults.ssl = false;
}

var client = new pg.Client({connectionString ,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();

var schema = 'public.';
var userTable = 'tbl_users';

app.use(bodyParser.urlencoded({ extended: false }));

const rootDir = require('path').resolve('./');

app.post('/users', function(req, res) {
    client.query('SELECT * FROM ' + userTable, function(error, data) {
	    if (error !== null) {
            client.query('SELECT * FROM ' + schema + userTable, function(error, data) {
                if (error !== null) {
                  console.log('Loading failed...');
                }
                else {
                    res.json(data.rows);
		        }
			});
		}
        else {
            res.json(data.rows);
		}
    });
});

app.get('/', function (req, res) {
   // res.send(rootDir);
   res.sendFile(rootDir + '\\index.html');
});

app.post('/submit-student-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send(name + ' Submitted Successfully!');
});


app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

app.delete('/delete-data', function (req, res) {
    res.send('DELETE Request');
});

var server = app.listen(5000, function () {
	console.log('Connection ' + connectionString);
    console.log('Node server is running..');
});