$('form').submit((e) => { // On form submitted
    e.preventDefault(); // Disable default behaviour of forms

    // Send POST request to /register
    $.post({
        url: '/register',
        data: {
            // Include data from form
            username: $('.username').val(),
            password: $('.password').val()
        },
        success: (res) => {
            if (res['success']) { // If request successful
                location.href = 'login.html'; // Go to login page
            }
            else { // If request unsuccessful
                // Show error message
                let errMsg = res['msg'];
                $('.err-msg').text(errMsg);
                $('.err-msg').show();
            }
        }
    });
});