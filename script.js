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
            $('.player-choice').html(emojis[choices.indexOf(playerChoice)]+playerChoice);
            $('.computer-choice').html(emojis[choices.indexOf(computerChoice)]+computerChoice);

            // If player and computer picked the same, inform it was a draw and increment both scores by 1
            if (playerChoice === computerChoice) {
                $('.round-winner').textContent = "It was a draw.";
                playerScore++;
                computerScore++;
            }
        
            else if (playerChoice === "rock") { // Otherwise if player chose rock
                if (computerChoice === "scissors") { // Computer chose scissors
                    $('.round-winner').html("You won the round."); // Set inner HTML of round-winner element to say player won the round
                    playerScore++; // Increment player score by 1
                }
                else { // Since we already checked if the choices were equal, this means computer chose paper
                    $('.round-winner').html("Computer won the round."); // Set innerHTML of round-winner element to say computer won the round
                    computerScore++; // Increment computer score by 1
                }
            }
        
            else if (playerChoice === "paper") {
                if (computerChoice === "rock") {
                    $('.round-winner').html("You won the round.");
                    playerScore++;
                }
                else {
                    $('.round-winner').html("Computer won the round.");
                    computerScore++;
                }
            }
        
            else {
                if (computerChoice === "paper") {
                    $('.round-winner').html("You won the round.");
                    playerScore++;
                }
                else {
                    $('.round-winner').html("Computer won the round.");
                    computerScore++;
                }
            }
        
            rounds--; // Decrement rounds by 1

            // Update HTML elements to reflect new rounds and scores
            $('.rounds').html(rounds);
            $('.player-score').html(playerScore);
            $('.computer-score').html(computerScore);
        
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
    if (playerScore === computerScore) {
        $('.game-winner').html("It was a draw.");
    }
    else if (playerScore > computerScore) {
        $('.game-winner').html("You won.");
    }
    else {
        $('.game-winner').html("Computer won.");
    }

    $('.winner-popup').show(); // Show winner-popup
}
