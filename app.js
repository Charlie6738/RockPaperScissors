// Import required modules
const http = require('http');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const accounts = require('./accounts');
const leaderboard = require('./leaderboard');

var db = accounts.init(); // Initialise database

var app = express(); // Create Express application
app.use(express.static(__dirname+'/public', {index: 'main.html'})); // Serve static files from public directory

// POST request register
// This will get information from registration form and enter it into database
app.post('/register', express.urlencoded({extended: true}), (req, res) => {
    // Get data submitted
    let username = req.body['username'];
    let password = crypto.createHmac('sha256',req.body['password']).digest('hex'); // SHA256 hash password

    // Run register function passing in username and password
    accounts.register(db, username, password, (err) => {
        if (err) { // If an error occured in function
            res.jsonp({
                success: false,
                msg: err.message
            });
        }
        else { // No error
            res.jsonp({
                success: true
            });
        }
    });
});

// POST request login
// Verify user details and then generate a unique session ID
app.post('/login', express.urlencoded({extended: true}), (req, res) => {
    // Get data submitted
    let username = req.body['username'];
    let password = crypto.createHmac('sha256',req.body['password']).digest('hex'); // SHA256 hash password
    
    // Check if username and password are valid
    accounts.login(db, username, password, (err, session) => {
        if (session) {
            res.jsonp({
                success: true,
                session: session
            });
        }
        else {
            res.jsonp({
                success: false,
                msg: err.message
            });
        }
    });
});

// POST request main
// This will get username corresponding to session
app.post('/main', express.urlencoded({extended: true}), (req, res) => {
    let session = req.body['session']; // Get session from request
    // Find username corresponding to session
    accounts.usernameFromSession(db, session, (err, username) => {
        if (username) { // Username found
            res.jsonp({
                success: true,
                username: username
            });
        }
        else {
            res.jsonp({
                success: false,
                msg: err
            });  
        }
    });
});

// POST request leaderboard
// This will get the ten entries from the users table with the highest win streak
app.post('/leaderboard', express.urlencoded({extended: true}), (req, res) => {
    leaderboard.topTen(db, (err, topTen) => {
        if (topTen) { // Entries found
            res.jsonp({
                success: true,
                topten: topTen
            });
        }
        else {
            res.jsonp({
                success: false,
                msg: err.message
            });
        }
    });
});

// POST request streakincrement
// Increase win streak of username corresponding to session by 1
app.post('/streakincrement',express.urlencoded({extended: true}), (req, res) => {
    let session = req.body['session']; // Get session from request
     // Find username corresponding to session
    accounts.usernameFromSession(db, session, (err,username) => {
        if (username) { // Username found
            // Increment win streak of username
            leaderboard.increment(db, username, (err) => {
                if (err) { // SQL error
                    res.jsonp({
                        success: false,
                        msg: err.message
                    });
                }
                else {
                    res.jsonp({
                        success: true
                    });
                }
            });
        }
        else { // Failed to obtain username, likely due to an error
            res.jsonp({
                success: false,
                msg: err.message
            });
        }
    });
});

// POST request streakreset
// Set win streak of username corresponding to session back to 0
app.post('/streakreset', express.urlencoded({extended: true}), (req, res) => {
    let session = req.body['session']; // Get session from request
     // Find username corresponding to session
    accounts.usernameFromSession(db, session, (err, username) => {
        if (username) { // If username found
            // Increment win streak of username
            leaderboard.reset(db, username, (err) => {
                if (err) { // SQL error
                    res.jsonp({
                        success: false,
                        msg: err.message
                    });
                }
                else {
                    res.jsonp({
                        success: true
                    });
                }
            });
        }
        else { // Failed to obtain username, likely due to an error
            res.jsonp({
                success: false,
                msg: err.message
            });
        }
    });
});

const server = http.createServer(app); // Create server running Express app
server.listen(8080); // Run on port 8080