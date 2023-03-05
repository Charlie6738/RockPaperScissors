// Import required modules
const http = require('http');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

// Open/create SQLite database and create table if it doesn't exist
var db = new sqlite3.Database('./db/leaderboard.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    winstreak INTEGER NOT NULL
);`);

db.run(`CREATE TABLE IF NOT EXISTS sessions (
    username TEXT NOT NULL,
    session TEXT NOT NULL UNIQUE
);`);

var app = express(); // Create Express application
app.use(express.static(__dirname+'/public', {index: 'main.html'})); // Serve static files from public directory

// POST request register
// This will get information from registration form and enter it into database
app.post('/register', express.urlencoded({extended:true}), (req,res) => {
    // Get data submitted
    let username = req.body['username'];
    let password = crypto.createHmac('sha256',req.body['password']).digest('hex'); // SHA256 hash password

    // Check if username already in use
    db.get(`SELECT username FROM users WHERE username='${username}';`, (err,row) => {
        if (row) { // Username already in use
            res.jsonp({
                success: false,
                msg: "Username already taken"
            });
        }
        else if (err) { // SQL error
            res.jsonp({
                success: false,
                msg: "SQL-related error, please contact administrators"
            });
        }
        else { // Username available
            // Insert new entry
            db.run(`INSERT INTO users (username,password,winstreak)
            VALUES ('${username}','${password}',0);`, (err) => {
                if (err) { // SQL error
                    res.jsonp({
                        success: false,
                        msg: "SQL-related error, please contact administrators"
                    }); 
                }
                else { // Insertion successful
                    res.jsonp({
                        success: true
                    })
                }
            });
        }
    });
});

// POST request login
// Verify user details and then generate a unique session ID
app.post('/login',express.urlencoded({extended:true}), (req,res) => {
    // Get data submitted
    let username = req.body['username'];
    let password = crypto.createHmac('sha256',req.body['password']).digest('hex'); // SHA256 hash password
    
    // Check if username and password are valid
    db.get(`SELECT username FROM users WHERE username='${username}' AND password='${password}';`, (err,row) => {
        if (row) {
            let session;

            while (true) {
                const chars = ["abcdefghijklmnopqrstuvwxyz".split(""),"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),"1234567890".split("")];
                session = "";

                // Loop i from 0 to 10
                for (let i = 0; i < 10; i++) {
                    // Select random character and add it to session identifier
                    let type = Math.floor(Math.random() * 3);
                    let char = Math.floor(Math.random() * chars[type].length);

                    session += chars[type][char];
                }

                // Determine if ID is already in use
                let idExists = false;
                db.get(`SELECT session FROM sessions WHERE sessionid='${session}';`, (err,row) => {
                    if (row) {
                        idExists = true;
                    }
                });

                if (idExists) { continue; }
                break;
            }

            // Insert new entry into sessions table
            db.run(`INSERT INTO sessions (username,session)
            VALUES ('${username}','${session}');`, (err) => {
                if (err) {
                    res.jsonp({
                        success: false,
                        msg: "SQL-related error, please contact administrators"
                    });                    
                }
                else {
                    res.jsonp({
                        success: true,
                        session: session
                    });
                }
            });
        }
        else if (err) { // SQL error
            res.jsonp({
                success: false,
                msg: "SQL-related error, please contact administrators"
            });
        }
        else { // Username or password invalid
            res.jsonp({
                success: false,
                msg: "Incorrect username or password"
            });
        }
    });
});

// POST request leaderboard
// This will get the ten entries from the users table with the highest winstreak
app.post('/leaderboard', express.urlencoded({extended:true}), (req,res) => {
    db.all(`SELECT username,winstreak FROM users ORDER BY winstreak DESC;`, (err,rows) => { // SQL command gets username and winstreak sorted descending by winstreak
        if (err) { // SQL error
            res.jsonp({
                success: false,
                msg: "SQL-related error, please contact administrators"
            });
        }
        else {
            // Get first ten entries
            let topTen = [];
            for (let i = 0; i < 10; i++) {
                if (rows[i]) { // If entry exists, push it to array
                    topTen.push(rows[i]);
                }
                else { break; } // Otherwise, break
            }
            res.jsonp({
                success: true,
                topten: topTen
            });
        }
    });
});

// POST request main
// This will get username corresponding to session
app.post('/main',express.urlencoded({extended:true}), (req,res) => {
    let session = req.body['session'];
    db.get(`SELECT username FROM sessions WHERE session='${session}';`, (err,row) => {
        if (row) {
            res.jsonp({
                success: true,
                username: row['username']
            });
        }
        else {
            res.jsonp({
                success: false
            });
        }
    });
});

// POST request streakincrement
// Increase winstreak of specified username by 1
app.post('/streakincrement',express.urlencoded({extended:true}), (req,res) => {
    let username = req.body['username']; // Get username sent in request
    // Get winstreak of entry matching username
    db.get(`SELECT winstreak FROM users WHERE username='${username}';`, (err,row) => {
        if (row) {
            let streak = row['winstreak'];
            streak++; // Increment

            // Update entry matching username
            db.run(`UPDATE users SET winstreak=${streak} WHERE username='${username}';`, (err) => {
                if (err) {
                    res.jsonp({
                        success: false
                    });
                }
                else {
                    res.jsonp({
                        success: true
                    });
                }
            });
        }
        else {
            res.jsonp({
                success: false
            });
        }
    });
});

// POST request streakreset
// Set winstreak of specified username back to 0
app.post('/streakreset',express.urlencoded({extended:true}), (req,res) => {
    let username = req.body['username']; // Get username sent in request
    // Set winstreak of entry with matching username to 0
    db.run(`UPDATE users SET winstreak=0 WHERE username='${username}';`, (err) => {
        if (err) {
            res.jsonp({
                success: false
            });
        }
        else {
            res.jsonp({
                success: true
            });
        }
    });
});

const server = http.createServer(app); // Create server running Express app
server.listen(8080); // Run on port 8080