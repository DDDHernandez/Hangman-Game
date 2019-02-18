
var Letter = function(Key) {
	this.Key = Key.toUpperCase();
	this.GuessedCorrectly = false;
	this.showCharacter = function() {
		if (this.GuessedCorrectly) {
			console.log(this.Key);
		}
		else {
			console.log ("_");
		}

	}
}

//export Letter constructor so that Word.js can use it.
module.exports = Letter

