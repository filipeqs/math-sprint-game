import shuffle from './shuffle.js';

// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0s';

// Scroll
let valueY = 0;

// Stop Timer, Proccess Results, go to Score Page
const checkTime = () => {
    if (playerGuessArray.length == questionAmount) {
        clearInterval(timer);
        // Check for wrong guessess and add penalty time
        equationsArray.forEach((equation, index) => {
            if (equation.evaluated !== playerGuessArray[index]) {
                // Wrong guess
                penaltyTime += 0.5;
            }
        });
        finalTime = timePlayed + penaltyTime;
        console.log(timePlayed, penaltyTime, finalTime);
    }
};

// Add a tenth of a second to time played
const addTime = () => {
    timePlayed += 0.1;
    console.log(timePlayed);
    checkTime();
};

// Start timer when game page is clicked
const startTimer = () => {
    // reset times
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0;
    timer = setInterval(addTime, 100);
    gamePage.removeEventListener('click', startTimer);
};

// Scroll, store user selectionin playerGuessArray
const select = (guessedTrue) => {
    // Scroll 80 pixels
    valueY += 80;
    itemContainer.scroll(0, valueY);
    // Add player guess to array
    return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
};
window.select = select;

// Displays Game Page
const showGamePage = () => {
    gamePage.hidden = false;
    countdownPage.hidden = true;
};

// Get Random Number up to a Max number
const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

// Create Correct/Incorrect Random Equations
function createEquations() {
    // Randomly choose how many correct equations there should be
    const correctEquations = getRandomInt(questionAmount);
    // Set amount of wrong equations
    const wrongEquations = questionAmount - correctEquations;
    // Loop through, multiply random numbers up to 9, push to array
    for (let i = 0; i < correctEquations; i++) {
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
        equationObject = { value: equation, evaluated: 'true' };
        equationsArray.push(equationObject);
    }
    // Loop through, mess with the equation results, push to array
    for (let i = 0; i < wrongEquations; i++) {
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
        wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
        wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
        const formatChoice = getRandomInt(3);
        const equation = wrongFormat[formatChoice];
        equationObject = { value: equation, evaluated: 'false' };
        equationsArray.push(equationObject);
    }

    shuffle(equationsArray);
}

// Add Equations to DOM
const equationsToDOM = () => {
    equationsArray.forEach((equation) => {
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Equation Text
        const equationText = document.createElement('h1');
        equationText.textContent = equation.value;
        // Append
        item.appendChild(equationText);
        itemContainer.appendChild(item);
    });
};

// Dynamically adding correct/incorrect equations
function populateGamePage() {
    // Reset DOM, Set Blank Space Above
    itemContainer.textContent = '';
    // Spacer
    const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
    // Selected Item
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    // Append
    itemContainer.append(topSpacer, selectedItem);

    // Create Equations, Build Elements in DOM
    createEquations();
    equationsToDOM();

    // Set Blank Space Below
    const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-500');
    itemContainer.appendChild(bottomSpacer);
}

// Display 3 2 1 go
const countdownStart = () => {
    countdown.textContent = '3';
    setTimeout(() => {
        countdown.textContent = '2';
    }, 1000);

    setTimeout(() => {
        countdown.textContent = '1';
    }, 2000);

    setTimeout(() => {
        countdown.textContent = 'GO!';
    }, 3000);
};

// Navigate from Splash Page to Countdown Page
const showCountDown = () => {
    countdownPage.hidden = false;
    splashPage.hidden = true;
};

// Get the value from selected radio button
const getRadioValue = () => {
    let radioValue;
    radioInputs.forEach((radioInput) => {
        if (radioInput.checked) radioValue = radioInput.value;
    });
    return radioValue;
};

// Form that decides amount of questions
const selectQuestionAmount = (e) => {
    e.preventDefault();
    questionAmount = getRadioValue();
    if (questionAmount) {
        showCountDown();
        countdownStart();
        populateGamePage();
        setTimeout(showGamePage, 4000);
    }
};

startForm.addEventListener('click', () => {
    radioContainers.forEach((radioEl) => {
        // Remove Selected Label Styling
        radioEl.classList.remove('selected-label');
        // Add it back if radio input is checked
        if (radioEl.children[1].checked) radioEl.classList.add('selected-label');
    });
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);
