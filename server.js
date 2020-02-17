var express = require('express');
var mysql = require('mysql');
var dotenv = require('dotenv');
var EmployeeTracker = require('./models/EmployeeTracker');

// Load environment variables if present for development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// ===============================
// EXPRESS CONFIGURATION
// This sets up the basic properties for the express server
// ===============================

// Tells node we are making an express server
var app = express();

// Sets an initial port, (will use later in server listener)
var PORT = process.env.PORT || 3000;

// Sets up the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===============================
// LISTENER
// The below code effectively "starts" our server
// ===============================

app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}`);
});

// ===============================
// MY SQL SETUP CONFIGS
// ===============================


// Setup mysql connection 
var connection = mysql.createConnection({
    host  : 'localhost',
    port: 3306,
    user  : "root",
    password: process.env.SQL_PASSWORD,
    database: "employ_trackerDB"
}); 

//Establish mysql connection
connection.connect(function(err) {
    if (err) {
        console.error(`Error connecting to database`);
        throw err;
    }
    console.error(`Success connecting to database ${connection.config.database} with id ${connection.threadId}`);
});