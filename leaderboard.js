// Function topTen
// Obtain the ten users with the highest win streak from database
const topTen = (db, callback) => {
    // Get all username and win streaks, sorted in descending order of win streak
    db.all(`SELECT username,winstreak FROM users ORDER BY winstreak DESC;`, (err,rows) => {
        if (err) { // SQL error
            return callback(Error("SQL-related error occured"));
        }
        else { // No error
            // Get first ten entries
            let topTen = [];
            for (let i = 0; i < 10; i++) {
                if (rows[i]) { // If entry exists, push it to array
                    topTen.push(rows[i]);
                }
                else { break; } // Otherwise, break
            }
            return callback(false,topTen);
        }
    });
}

// Function increment
// Increase the win streak of specified username by 1
const increment = (db, username, callback) => {
    // Get current win streak of username
    db.get(`SELECT winstreak FROM users WHERE username='${username}';`, (err, row) => {
        if (row) {
            let streak = row['winstreak'];
            streak++; // Increment by 1

            // Update win streak of username to new value
            db.run(`UPDATE users SET winstreak=${streak} WHERE username='${username}';`, (err) => {
                if (err) {
                    return callback(Error("SQL-related error occured"));
                }
                else {
                    return callback(false);
                }
            });
        }
        else if (err) { // SQL error
            return callback(Error("SQL-related error occured"));
        }
        else { // No error but no entry found
            return callback(Error("User not found"));
        }
    });
}

// Function reset
// Set win streak of specified username to 0
const reset = (db, username, callback) => {
    // Update win streak of username to 0
    db.run(`UPDATE users SET winstreak=0 WHERE username='${username}';`, (err) => {
        if (err) { // SQL error
            return callback(Error("SQL-related error occured"));
        }
        else {
            return callback(false);
        }
    });
}

module.exports = {topTen, increment, reset}