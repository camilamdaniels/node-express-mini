const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

let word = [];
let wordSoFar;
let lettersGuessed = [];
let wrongCount = 0;
let index;
let flag = true;
/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

const chooseWord = () => {
	index = Math.floor(Math.random() * readWords().length);
	word = readWords()[index].split('');
	wordSoFar = new Array(word.length);
	for (let i = 0; i < wordSoFar.length; i++) {
		wordSoFar[i] = '-';
	}
};

chooseWord();

server.post('/guess', (req, res) => {

	const letter = req.body.letter;

	if (!letter) {
		res.status(STATUS_USER_ERROR);
		res.json({error: 'Please enter a letter :)'});
	}  

	if (letter.length > 1) {
		res.status(STATUS_USER_ERROR);
		res.json({error: 'You\'re only allowed to guess one letter at a time.'});
	}

	if (!lettersGuessed.includes(letter)) {
		lettersGuessed.push(letter);
	} else {
		res.status(STATUS_USER_ERROR);
		res.json({error: 'You\'ve guessed this letter already! Choose another one.'});
	}

	for (let i = 0; i < word.length; i++) {
		if (word[i] === letter) {
			wordSoFar[i] = letter;
		} 
	}

	if (!word.includes(letter)) flag = false;

	if (flag === false) {
		wrongCount += 1;
		if (wrongCount < 7) {
			res.send(`Incorrect! You've made ${wrongCount} incorrect guesses. You have ${(7-wrongCount)} guesses left.`);
		} else if (wrongCount >= 7) {
			res.send('YOU LOSE!');
		}
	}
	res.json({
		wordSoFar: wordSoFar,
		guesses: lettersGuessed
	});
});

server.get('/answer', (req, res) => {
	res.send(word);
})

server.get('/guess', (req, res) => {
	// res.send(wordSoFar.join(''));
	res.json({
		wordSoFar: wordSoFar,
		guesses: lettersGuessed
	});
});

// TODO: your code to handle requests

server.listen(3000);
