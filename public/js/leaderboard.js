// Send POST request to /leaderboard
$.post({
    url: '/leaderboard',
    // When response received
    success: (res) => {
        if (res['success']) { // If request successful
            let topTen = res['topten']; // Get top 10 users

            // Loop from 0 to length of topTen, in case there are less than 10 users registered overall
            for (let i = 0; i < topTen.length; i++) {
                // Add row to leaderboard table with place number, username, and winstreak
                var row = $(`<tr>
                    <td>${i+1}</td>
                    <td>${topTen[i]['username']}</td>
                    <td>${topTen[i]['winstreak']}</td>
                </tr>`);
                $('.leaderboard').append(row);
            }
        }
    }
});