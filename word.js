
var Letter = require("./letter");

var Word = function(TheWord) {
    this.TheWord = TheWord;
    this.underscores = [];
    this.letters = [];
    
	this.space = function() {
		this.letters = this.TheWord.split("");
		numberofUnderscores = this.letters.length;
		console.log(this.underscores.join(" "));
	}
	this.CreateLetters = function() {
		for (i=0; i < this.letters.length; i++){
			this.letters[i] = new Letter (this.letters[i]);
			this.letters[i].showCharacter();
		}
	}
}

//Export the Word constructor so that we can use/reference it in index.js.
module.exports = Word;
