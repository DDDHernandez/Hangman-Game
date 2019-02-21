
//Game requires inquirer npm package
//NPM package used to check if letter is an actual letter (a-z).
var Word = require("./word.js");
var inquirer = require("inquirer");
var isLetter = require('is-letter');

//Our word bank
var PlayerGuessedCorrect = false;
var wordList = ["KansasCity", "LeesSummit", "GrainValley", "SaintJoseph", "Independence", "BlueSprings", "Smithville", "Columbia", "Maryville"];
var randomWordtoGuess;
var KeyWord;

//Counters for wins, losses, and guesses remaining.
var guessesthatRemain = 12;
var wins = 0;
var losses = 0;


//Creating a variable to hold the letter that the user enters at the inquirer prompt.
var userGuess = "";
var spacesFilled = 0;
var TheGuessedList = "";
var lettersGuessedList = [];

Game();
//When user enters game, convert "Hangman Game" text characters to drawings using figlet npm package.
function Game(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    console.log("Welcome to Hangman!");
    console.log("The theme is cities around the KC Metro Area...");
    var Instructions = 
    "How to play" + "\r\n" +
    "=====================================================================================================" + "\r\n" +
    "When the game begins you will be propmted to enter a letter(a-z)." + "\r\n" +
    "If the letter you guess is incorrect then you will not see the letter you guess and" + "\r\n" + 
    "for every guess, the number of guesses decrease by 1." + "\r\n" +
    "If the letter you guess is correct then your guess will appear on the screen." + "\r\n" +
    "If you guess all the letters in the word without running out of guesses, you win." + "\r\n" +
    "If you fail to do so then you lose. Game over." + "\r\n" +
    "======================================================================================================" + "\r\n" +
    "You can exit the game at any time by pressing Ctrl + C on your keyboard." + "\r\n" +
    "======================================================================================================" 
    console.log(Instructions);
    Startup();
};

function Startup() {
	var beginGame = [
	 {
	 	type: 'text',
	 	name: 'userName',
	 	message: 'What is your name?'
	 },
	 {
	    type: 'confirm',
	    name: 'Play',
	    message: 'Are you ready to play?',
	    default: true
	  }
	];

	inquirer.prompt(beginGame).then(answers => {
		if (answers.Play){
			console.log("Welcome, " + answers.userName + ". Get Ready to play!!");
			startGame();
		}

		else {
			console.log("Good bye, " + answers.userName + "! Come back soon.");
			return;
		}
	});
}

//Start game function.
function startGame(){
	guessesthatRemain = 12;
	RandomWord();
	TheGuessedList = "";
	lettersGuessedList = [];
}

//Function to choose a random word from the list of cities in the word bank array.
function RandomWord() {
randomWordtoGuess = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
KeyWord = new Word (randomWordtoGuess);
console.log("Your word contains " + randomWordtoGuess.length + " letters.");
console.log("WORD TO GUESS:");
KeyWord.space();
KeyWord.CreateLetters();
Usersguessedletter();
}

//Function that will prompt the user to enter a letter. This letter is the user's guess.
function Usersguessedletter(){
	if (spacesFilled < KeyWord.letters.length || guessesthatRemain > 0) {
	inquirer.prompt([
  {
    name: "letter",
    message: "Guess a letter:",
    validate: function(value) {
        if(isLetter(value)){
          return true;
        } 
        else {
          return false;
        }
      }
  }
]).then(function(guess) {
    guess.letter.toUpperCase();
	console.log("You guessed: " + guess.letter.toUpperCase());
	PlayerGuessedCorrect = false;
	//Find out if letter was already guessed by the user. If already guessed by the user, notify the user to enter another letter.
	if (lettersGuessedList.indexOf(guess.letter.toUpperCase()) > -1) {
		console.log("You already guessed that letter. Enter another one.");
		console.log("=====================================================================");
		Usersguessedletter();
	}

	//If user entered a letter that was not already guessed...
	else if (lettersGuessedList.indexOf(guess.letter.toUpperCase()) === -1) {
		TheGuessedList = TheGuessedList.concat(" " + guess.letter.toUpperCase());
		lettersGuessedList.push(guess.letter.toUpperCase());
		console.log('Letters already guessed: ' + TheGuessedList);

		//We need to loop through all of the letters in the word, 
		for (i=0; i < KeyWord.letters.length; i++) {
			if (guess.letter.toUpperCase() === KeyWord.letters[i].Key && KeyWord.letters[i].GuessedCorrectly === false) {
				KeyWord.letters[i].GuessedCorrectly === true;
				PlayerGuessedCorrect = true;
				KeyWord.underscores[i] = guess.letter.toUpperCase();
				spacesFilled++
			}
		}
		console.log("WORD TO GUESS:");
		KeyWord.space();
		KeyWord.CreateLetters();

		//If user guessed correctly...
		if (PlayerGuessedCorrect) {
			console.log('CORRECT!');
			console.log("=====================================================================");
			DidUserWin();
		}

		//If user guessed incorrectly.
		else {
			console.log('INCORRECT!');
			guessesthatRemain--;
			console.log("You have " + guessesthatRemain + " guesses left.");
			console.log("=====================================================================");
			DidUserWin();
		}
	}
});
}
}

//Check if the user won or lost after user guesses letter.
function DidUserWin() {
	if (guessesthatRemain === 0) {
		console.log('Sorry Game Over.');
		console.log("The correct city was: " + randomWordtoGuess);
        losses++;
        console.log("===================================================================");
		console.log("Losses: " + losses);
		console.log("Wins: " + wins);
		Retry();
	}

	//if the number of slots filled equals the number of letters in the word, user wins.
	else if (spacesFilled === KeyWord.letters.length) {
		console.log("=====================================================================");
		console.log("Nice Job, You won!");
		wins++;
		console.log("=====================================================================");
		console.log("Wins: " + wins);
		console.log("Losses: " + losses);
		
		Retry();
	}

	else {
		Usersguessedletter("");
	}

}

function Retry() {
	var playAgain = [
	 {
	    type: 'confirm',
	    name: 'playAgain',
	    message: 'Do you want to play again?',
	    default: true
	  }
	];

	inquirer.prompt(playAgain).then(userOptedTo => {
		if (userOptedTo.playAgain){
            spacesFilled = 0;
			TheGuessedList = "";
			lettersGuessedList = [];
			
			console.log("Glad to see you are back. Let's begin...");
			startGame();
		}

		else {
			console.log("Hope to see you again!");
			return;
        }
    })
}