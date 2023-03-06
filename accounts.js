const sqlite3 = require('sqlite3').verbose(); // Import SQLite3 module in verbose mode

// Function init
// Open/create SQLite database and create table if it doesn't exist
const init = () => {
    var db = new sqlite3.Database('./db/leaderboard.db'); // Open/create database at db/leaderboard.db

    // Create tables for user details and sessions if they don't already exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        winstreak INTEGER NOT NULL
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS sessions (
        username TEXT NOT NULL,
        session TEXT NOT NULL UNIQUE
    );`);

    return db;
}

// Function register
// Check if username is available and if so, register them in database
const register = (db, username, password, callback) => {
    // Check if username already in use
    db.get(`SELECT username FROM users WHERE username='${username}';`, (err, row) => {
        if (row) { // Username already in use
            return callback(Error("Username already taken"));
        }
        else if (err) { // SQL error
            return callback(Error("SQL-related error occured"));
        }
        else { // Username available
            // Insert new entry
            db.run(`INSERT INTO users (username,password,winstreak)
            VALUES ('${username}','${password}',0);`, (err) => {
                if (err) { // SQL error
                    return callback(Error("SQL-related error occured"));
                }
                else { // Insertion successful
                    return callback(false);

                }
            });
        }
    });
}

// Function login
// Check username and password are correct and if so, register a unique session ID
const login = (db, username, password, callback) => {
    // Verify if username and password are correct
    db.get(`SELECT username FROM users WHERE username='${username}' AND password='${password}';`, (err, row) => {
        if (row) { // Entry found, so they are correct
            // Generate unique session identifier of upper/lowercase letters and numbers to store in cookie
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
                    return callback(Error("SQL-related error occured"));
                }
                else {
                    return callback(false,session);
                }
            });
        }

        else if (err) { // SQL error
            return callback(Error("SQL-related error occured"));
        }

        else { // Username or password invalid
            return callback(Error("Incorrect username or password"));
        }
    });
}

// Function usernameFromSession
// Find username corresponding to specified session
const usernameFromSession = (db,session,callback) => {
    // Get username from sessions table matching session
    db.get(`SELECT username FROM sessions WHERE session='${session}';`, (err,row) => {
        if (row) { // Username found
            return callback(false,row['username']);
        }
        else if (err) { // SQL error
            return callback(Error("SQL-related error occured"));
        }
        else { // Username not found
            return callback(Error("Session invalid"));
        }
    });
}

module.exports = {init,register,login,usernameFromSession};