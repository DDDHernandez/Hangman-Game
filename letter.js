
const Letter = function(Person) {
	this.Person = Person.toUpperCase();
	this.GuessedCorrectly = false;
	this.showCharacter = function() {
		if (this.GuessedCorrectly) {
			console.log(this.character);
		}
		else {
			console.log ("_");
		}

	}
}

//export Letter constructor so that Word.js can use it.
module.exports = Letter

