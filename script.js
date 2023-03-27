const wordE1 = document.getElementById('word');
const wrongLettersE1 = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const fileInput = document.getElementById('file-input');

const figureParts = document.querySelectorAll('.figure-part');

let selectedWord;

const correctLetters = [];
const wrongLetters = [];

// Fetch random word from API
async function fetchRandomWord() {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    const data = await response.json();
    selectedWord = data[0];
  } catch (err) {
    console.error(err);
  }
}

// Show hidden word
function displayWord() {
  wordE1.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ''}
        </span>
        `
      )
      .join('')}
    `;

  const innerWord = wordE1.innerText.replace(/\n/g, '');

  if (innerWord === selectedWord) {
    finalMessage.innerText = 'Congratulations! You won! 😃';
    popup.style.display = 'flex';
  }
}

// Update the wrong letters
function updateWrongLetterE1() {
  // Display wrong letters
  wrongLettersE1.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = 'Game over loser. 😕';
    popup.style.display = 'flex';
  }
}

// Show notification
function showNotification() {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Keydown letter press
window.addEventListener('keydown', (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key;
  
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
          updateWrongLetterE1();
        } else {
          showNotification();
        }
      }
    }
  });

// Restart game and play again
playAgainBtn.addEventListener('click', async () => {
  // Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  await fetchRandomWord();

  displayWord();

  updateWrongLetterE1();

  popup.style.display = 'none';

  // Reset figure
  figureParts.forEach((part) => {
    part.style.display = 'none';
  });
});


(async function init() {
  await fetchRandomWord();
  displayWord();
})();
