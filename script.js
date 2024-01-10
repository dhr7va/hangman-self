const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

let playable = true;

const correctLetters = [];
const wrongLetters = [];

async function fetchRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching random word:', error);
    }
}

async function initializeGame() {
    try {
        const randomWord = await fetchRandomWord();
        if (randomWord && typeof randomWord === 'string') {
            return randomWord.toLowerCase();
        } else {
            // Use a default word if there's an issue with the API
            return 'hangman';
        }
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

let selectedWord;

async function startNewGame() {
    selectedWord = await initializeGame();
    correctLetters.length = 0;
    wrongLetters.length = 0;
    playable = true;

    displayWord();
    updateWrongLettersEl();
    popup.style.display = 'none';
}

function displayWord() {
    wordEl.innerHTML = `
        ${selectedWord
            .split('')
            .map(
                letter => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : ''}
                    </span>
                `
            )
            .join('')}
    `;

    const innerWord = wordEl.innerText.replace(/\n/g, '');
    if (innerWord === selectedWord) {
        finalMessage.innerText = 'Congratulations! You won! 😃';
        popup.style.display = 'flex';
        playable = false;
    }
}

function updateWrongLettersEl() {
    wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;

    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = `Unfortunately you lost. 😕 The word was: ${selectedWord}`;
        popup.style.display = 'flex';
        playable = false;
    }
}

function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

window.addEventListener('keydown', e => {
    if (playable) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            const letter = e.key.toLowerCase();
            if (selectedWord.includes(letter)) {
                if (!correctLetters.includes(letter)) {
                    correctLetters.push(letter);
                    displayWord();
                } else {
                    showNotification();
                }
            } else {
                if (!wrongLetters.includes(letter)) {
                    wrongLetters.push(letter);
                    updateWrongLettersEl();
                } else {
                    showNotification();
                }
            }
        }
    }
});

playAgainBtn.addEventListener('click', startNewGame);

// Initial game setup
startNewGame();
