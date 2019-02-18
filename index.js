
//Game requires inquirer npm package
//NPM package used to check if letter is an actual letter (a-z).
var Word = require("./word.js");
var inquirer = require("inquirer");
var isLetter = require('is-letter');

//When user guesses correctly, set this variable to true for that letter. The default value will be false.
//Our word bank
//Choose random word from wordList.
var userGuessedCorrectly = false;
var wordList = ["Kansas City", "Lee's Summit", "Grain Valley", "Saint Joseph", "Independence", "Blue Springs", "Smithville", "Columbia", "Maryville"];
var randomWordtoGuess;
var KeyWord;

//Counters for wins, losses, and guesses remaining.
var wins = 0;
var losses = 0;
var guessesthatRemain = 12;

//Creating a variable to hold the letter that the user enters at the inquirer prompt.
var userGuess = "";

var AlreadyGuessedList = "";
var lettersAlreadyGuessedListArray = [];

var spacesFilled = 0;
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
    console.log("The Theme is cities around the KC Metro Area...");
    var Instructions = 
    "How to play" + "\r\n" +
    "==========================================================================================================" + "\r\n" +
    "When the game begins you will be propmted to enter a letter(a-z)." + "\r\n" +
    "If the letter you guessed is incorrect then you will not see the letter you guessed and" + "\r\n" + 
    "for every guess, the number of guesses decrease by 1." + "\r\n" +
    "If the letter you guees is correct then your guess will appear on the screen." + "\r\n" +
    "If you guess all the letters in the word without running out of guesses, you win." + "\r\n" +
    "If you fail to do so then you lose. Game over." + "\r\n" +
    "===========================================================================================================" + "\r\n" +
    "You can exit the game at any time by pressing Ctrl + C on your keyboard." + "\r\n" +
    "===========================================================================================================" 
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
	AlreadyGuessedList = "";
	lettersAlreadyGuessedListArray = [];
}

//Function to choose a random word from the list of cities in the word bank array.
function RandomWord() {
randomWordtoGuess = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
KeyWord = new Word (randomWordtoGuess);
console.log("Your word contains " + randomWordtoGuess.length + " letters.");
console.log("WORD TO GUESS:");
KeyWord.space();
KeyWord.CreateLetters();
Usersletterguessed();
}

//Function that will prompt the user to enter a letter. This letter is the user's guess.
function Usersletterguessed(){
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
]).then(function(userguess) {
	//Convert all letters to upper case.
    userguess.letter.toUpperCase();
	console.log("You guessed: " + userguess.letter.toUpperCase());
	GuessedCorrectly = false;
	//Find out if letter was already guessed by the user. If already guessed by the user, notify the user to enter another letter.
	if (lettersAlreadyGuessedListArray.indexOf(userguess.letter.toUpperCase()) > -1) {
		console.log("You already guessed that letter. Enter another one.");
		console.log("=====================================================================");
		Usersletterguessed();
	}

	//If user entered a letter that was not already guessed...
	else if (lettersAlreadyGuessedListArray.indexOf(userguess.letter.toUpperCase()) === -1) {
		//Add letter to list of already guessed letters.
		AlreadyGuessedList = AlreadyGuessedList.concat(" " + userguess.letter.toUpperCase());
		lettersAlreadyGuessedListArray.push(userguess.letter.toUpperCase());
		//Show letters already guessed to user.
		console.log('Letters already guessed: ') + lettersAlreadyGuessedList, {padding: 1};

		//We need to loop through all of the letters in the word, 
		for (i=0; i < KeyWord.letters.length; i++) {
			if (userguess.letter.toUpperCase() === KeyWord.letters[i].character && KeyWord.letters[i].GuessedCorrectly === false) {
				KeyWord.letters[i].GuessedCorrectly === true;
				GuessedCorrectly = true;
				KeyWord.underscores[i] = userguess.letter.toUpperCase();
				spacesFilled++
			}
		}
		console.log("WORD TO GUESS:");
		KeyWord.space();
		KeyWord.CreateLetters();

		//If user guessed correctly...
		if (userGuessedCorrectly) {
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
		playAgain();
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
		Usersletterguessed("");
	}

}

//ask user if they want to play again.
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
			AlreadyGuessedList = "";
			lettersAlreadyGuessedListArray = [];
			
			console.log("Glad to see you are back. Let's begin...");
			startGame();
		}

		else {
			console.log("Hope to see you again!");
			return;
        }
    })
}