// Get session and if not signed in, go to login page
let session = document.cookie.split("; ").find((row) => row.startsWith("session=")) ?.split("=")[1];
if (!session) {
    location.href = "login.html";
}

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

$('.leaderboard-button').click(() => {
    location.href = "leaderboard.html";
});

$('.signout-button').click(() => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.href = "login.html";
});
