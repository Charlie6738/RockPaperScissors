// Get session and if not signed in, go to login page
let session = document.cookie.split("; ").find((row) => row.startsWith("session=")) ?.split("=")[1];
if (!session) {
    location.href = "login.html";
}

// Define rounds and scores
var rounds;
var playerScore = 0;
var computerScore = 0;

// Validate user input upon click of start-button
$('.start-button').click(() => {
    rounds = parseInt($('.rounds-input').val()); // Get integer value from rounds-input element

    if (rounds < 1 || isNaN(rounds)) { // If rounds is less than 1 or isn't a number
        $('.err-msg').show(); // Show error
    }
    else {
        $('.rounds-popup').hide(); // Hide popup
        $('.rounds').html(rounds); // Set inner HTML of rounds element
        round(); // Call round function
    }
});

// Function round
// Both player and computer make their pick, before they are compared to see who won the round and scores are incremented accordingly
function round() {
    let playerChoice;

    // Player choice set according to button clicked
    $('.rock-button').click(() => {
        playerChoice = "rock";
    });

    $('.paper-button').click(() => {
        playerChoice = "paper";
    });

    $('.scissors-button').click(() => {
        playerChoice = "scissors";
    });

    // Wait until player has made their pick
    (function wait() {
        if (playerChoice) { // If player has chosen
            // Randomly select computer choice from three options along with corresponding emoji
            const choices = ["rock","paper","scissors"];
            const emojis = ["✊","✋","✌️"];
            let computerChoice = choices[Math.floor(Math.random() *3)];
            
            // Set HTML elements to display player and computer choice alongside emojis
            $('.player-choice').text(emojis[choices.indexOf(playerChoice)]+playerChoice);
            $('.computer-choice').text(emojis[choices.indexOf(computerChoice)]+computerChoice);

            // If player and computer picked the same, inform it was a draw and increment both scores by 1
            if (playerChoice === computerChoice) {
                $('.round-winner').text("It was a draw.");
                playerScore++;
                computerScore++;
            }
        
            else if (playerChoice === "rock") { // Otherwise if player chose rock
                if (computerChoice === "scissors") { // Computer chose scissors
                    $('.round-winner').text("You won the round."); // Set text of round-winner element to say player won the round
                    playerScore++; // Increment player score by 1
                }
                else { // Since we already checked if the choices were equal, this means computer chose paper
                    $('.round-winner').text("Computer won the round."); // Set text of round-winner element to say computer won the round
                    computerScore++; // Increment computer score by 1
                }
            }
        
            else if (playerChoice === "paper") {
                if (computerChoice === "rock") {
                    $('.round-winner').text("You won the round.");
                    playerScore++;
                }
                else {
                    $('.round-winner').text("Computer won the round.");
                    computerScore++;
                }
            }
        
            else {
                if (computerChoice === "paper") {
                    $('.round-winner').text("You won the round.");
                    playerScore++;
                }
                else {
                    $('.round-winner').text("Computer won the round.");
                    computerScore++;
                }
            }
        
            rounds--; // Decrement rounds by 1

            // Update HTML elements to reflect new rounds and scores
            $('.rounds').text(rounds);
            $('.player-score').text(playerScore);
            $('.computer-score').text(computerScore);
        
            if (rounds > 0) {
                round(); // Another round
            }
            else { // Game over
                winner();
            }
        }
        else { // If playerChoice undefined
            setTimeout(wait,250); // Run wait function again in 250 milliseconds
        }
    })();
}

// Function winner
// Determine the winner of the game
function winner() {
    // If player won, send POST request to /streakincrement to increase winstreak
    if (playerScore > computerScore) {
        $.post({
            url: "/streakincrement",
            data: {
                session: session
            }
        });
        
        $('.game-winner').text("You won."); // Display player won
    }
    
    // If player lost or drew with computer, send POST request to /streakreset to set their winstreak to 0
    else {
        $.post({
            url: "/streakreset",
            data: {
                session: session
            }
        });
        
        if (playerScore === computerScore) { // If player and computer drew
            $('.game-winner').text("It was a draw.");
        }
        else { // If computer won
            $('.game-winner').text("Computer won.");
        }
        
    }
    $('.winner-popup').show(); // Show hidden winner popup
}
