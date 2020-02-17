const mysql = require("mysql");
const util = require('util');

class EmployeeTracker{
    constructor() {
        this.conn = mysql.createConnection({
                host  : 'localhost',
                port: 3306,
                user  : "root",
                password: process.env.SQL_PASSWORD,
                database: "employ_trackerDB"
        }); 
    }

    start() {
        console.log("Starting prompt");
    }

    async connect() {
        this.conn.connect(function(err) {
            if (err) {
                console.error(`Error connecting to database`);
                throw err;
            }
            console.error(`Success connecting to database `);
            return this.conn;
        });
    }
}

module.exports = EmployeeTracker;