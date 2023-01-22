function startGame() { // Declare function startGame
    var rounds = parseInt(document.querySelector(".rounds-input").value); // Define rounds as value of rounds-input converted to int
    var playerScore = 0; // Declare playerScore and define as 0
    var computerScore = 0;
    if (rounds > 0 && !isNaN(rounds)) { // If rounds is more than 0 and rounds is not NaN (not a number)
        document.querySelector(".rounds-popup").hidden = true; // Hide rounds-popup
        document.querySelector(".rounds").textContent = rounds; // Set text content of element rounds to variable rounds
        Game(); // Call Game()
    }
    else { // Else
        document.querySelector(".err-msg").hidden = false; // Show err-msg, don't start the game
    }
    
    function Game() { // Declare function Game
        let playerChoice; // Declare playerChoice
        document.querySelector(".rock-button").addEventListener('click',function () { // When rock-button is clicked
            playerChoice = "rock"; // Define playerChoice as rock
        });
        document.querySelector(".paper-button").addEventListener('click',function () { // When paper-button is clicked
            playerChoice = "paper"; // Define playerChoice as paper
        });
        document.querySelector(".scissors-button").addEventListener('click',function () { // When scissors-button is clicked
            playerChoice = "scissors"; // Define playerChoice as scissors
        });
        (function waitForClick() { // Declare function waitForClick in brackets so it can be executed instantly 
            if (playerChoice !== undefined) { // If playerChoice is NOT undefined
                const choices = ["rock","paper","scissors"]; // Define choices as array of three choices
                let computerChoice = choices[Math.floor(Math.random() *3)]; // Define computerChoice as random choice from choices
                roundWinner(playerChoice,computerChoice); // Call roundWinner passing playerChoice and computerChoice as parameters

                rounds--; // Decrement rounds
                document.querySelector(".rounds").textContent = rounds; // Set text content of element rounds to variable rounds
                document.querySelector(".player-score").textContent = playerScore; // Set text content of player-score to playerScore
                document.querySelector(".computer-score").textContent = computerScore; // Set text content of computer-score to computerScore
                     
                if (rounds > 0) { // If rounds is more than 0
                    Game(); // Call Game() again
                }
                else { // Otherwise
                    gameWinner(); // Call gameWinner()
                }
            }
            else { // Else (if playerChoice is undefineed)
                setTimeout(waitForClick,250); // Execute again in 250 milliseconds
            }
        })(); // Execute function immediately; no need to call it
   
    }

    function roundWinner(pc,cc) { // Declare function roundWinner taking in two parameters
        const choices = ["rock","paper","scissors"]; // Define choices as array of three choices
        const emojis = ["✊","✋","✌️"]; // Define emojis as array of three emojis
        document.querySelector(".player-choice").textContent = emojis[choices.indexOf(pc)] + pc; // Set text content of player-choice to emoji and text of pc (player choice)
        document.querySelector(".computer-choice").textContent = emojis[choices.indexOf(cc)] + cc; // Set text content of computer-choicr to emoji and text of cc (computer choice)

        if (pc === cc) { // If pc is strictly equal to cc
            document.querySelector(".round-winner").textContent = "It was a draw."; // Set text content of round-winner 
            playerScore++; // Increment playerScore
            computerScore++; // Increment computerScore
        }
        else if (pc === "rock") { // Else if pc is rock
            if (cc === "scissors") { // If cc is scissors
                document.querySelector(".round-winner").textContent = "You won."; // Set text content of round-winner to say player won
                playerScore++; // Increment playerScore
            }
            else { // Otherwise
                document.querySelector(".round-winner").textContent = "Computer won."; // Set text content of round-winner to say computer won
                computerScore++; // Increment computerScore
            }
        }
        else if (pc === "paper") { // Else if pc is paper
            if (cc === "rock") { // If cc is rock
                document.querySelector(".round-winner").textContent = "You won.";
                playerScore++;
            }
            else {
                document.querySelector(".round-winner").textContent = "Computer won.";
                computerScore++;                
            }
        }
        else if (pc === "scissors") { // Else if pc is scissors
            if (cc === "paper") { // If cc is paper
                document.querySelector(".round-winner").textContent = "You won.";
                playerScore++;
            }
            else {
                document.querySelector(".round-winner").textContent = "Computer won.";
                computerScore++;                
            }
        }
    }

    function gameWinner() { // Declare function gameWinner
        if (playerScore > computerScore) { // If playerScore is more than computerScore
            document.querySelector(".game-winner").textContent = "You win."; // Set text content of game-winner to say player won
        }
        else if (computerScore > playerScore) { // Else if computerScore is more than playerScore 
            document.querySelector(".game-winner").textContent = "Computer wins."; // Set text content of game-winner to say computer won
        }
        else { // Otherwise (it was a draw)
            document.querySelector(".game-winner").textContent = "It's a draw."; // Set text content of game-winner to say it was a draw
        }
        document.querySelector(".winner-popup").hidden = false; // Show winner-popup
    }
}
