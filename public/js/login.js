$('form').submit((e) => { // On form submitted
    e.preventDefault(); // Disable default behaviour of form

    // Send POST request to /login
    $.post({
        url: '/login',
        data: {
            // Include data from form
            username: $('.username').val(),
            password: $('.password').val()
        },
        success: (res) => {
            if (res['success']) { // If request successful
                // Set cookie with session and go to main page
                let session = res['session'];
                document.cookie = `session=${session}; path=/`;
                location.href = "main.html";
            }
            else { // If request unsuccessful
                // Show error message
                let err = res['msg'];
                $('.err-msg').show();
                $('.err-msg').text(err);
            }
        }
    })
});