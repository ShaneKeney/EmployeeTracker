var express = require('express');

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
})