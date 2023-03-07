// Get session and if not signed in, go to login page
let session = document.cookie.split("; ").find((row) => row.startsWith("session=")) ?.split("=")[1];
if (!session) {
    location.href = "login.html";
}

// Send POST request to /leaderboard
$.post({
    url: '/leaderboard',
    // When response received
    success: (res) => {
        if (res['success']) { // If request successful
            let topTen = res['topten']; // Get top 10 users
    
            // Loop from 0 to length of topTen, in case there are less than 10 users registered overall
            for (let i = 0; i < 10; i++) {
                // Add row to leaderboard table with place number, username, and winstreak
                let row;
                try {
                    row = $(`<tr>
                        <td>${i+1}</td>
                        <td>${topTen[i]['username']}</td>
                        <td>${topTen[i]['winstreak']}</td>
                    </tr>`);
                }
                catch {
                    row = $(`<tr>
                        <td>${i+1}</td>
                        <td> </td>
                        <td> </td>
                    </tr>`);
                }
                $('.leaderboard').append(row);
            }
        }
    }
});

// Send POST request to /main to get username from session
$.post({
    url: "/main",
    data: {
        session: session
    },
    success: (res) => {
        if (res['success']) { // If request successful
            // Set text of username element to username
            let username = res['username'];
            $('.username').text(username);
        }
        else { // If request unsuccessful
            // Log the user out
            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            location.href = "login.html";
        }
    }
});

$('.play-button').click(() => {
    location.href = "game.html";
});

$('.show-leaderboard-button').click(() => {
    $('.leaderboard-container').show();
});

$('.close-leaderboard-button').click(() => {
    $('.leaderboard-container').hide();
});

$('.signout-button').click(() => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.href = "login.html";
});
