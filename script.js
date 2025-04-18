let firstNumber = '';
let operator = '';
let secondNumber = '';
let displayValue = '';
let equationString = '';

const display = document.getElementById('display');
const equation = document.getElementById('equation');
const fartSound = document.getElementById('fartSound');

// Load multiple fart sounds
const fartSounds = [
    'https://www.soundjay.com/human/sounds/fart-01.mp3',
    'https://www.soundjay.com/human/sounds/fart-02.mp3',
    'https://www.soundjay.com/human/sounds/fart-03.mp3'
];

// Preload the fart sounds
fartSounds.forEach(sound => {
    const audio = new Audio(sound);
    audio.preload = 'auto';
});

function updateEquation() {
    let eq = firstNumber;
    if (operator) {
        eq += ` ${getOperatorSymbol(operator)} `;
        if (secondNumber) {
            eq += secondNumber;
        }
    }
    equation.value = eq;
}

function getOperatorSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function appendNumber(num) {
    // Prevent multiple decimal points
    if (num === '.' && (
        (operator === '' && firstNumber.includes('.')) ||
        (operator !== '' && secondNumber.includes('.'))
    )) {
        return;
    }

    if (operator === '') {
        firstNumber += num;
        displayValue = firstNumber;
    } else {
        secondNumber += num;
        displayValue = secondNumber;
    }
    updateDisplay();
    updateEquation();
}

function setOperator(op) {
    if (firstNumber === '') return;
    
    // If we already have a complete equation, use the result as the first number
    if (operator !== '' && secondNumber !== '') {
        calculate(false);
    }
    
    operator = op;
    displayValue = '';
    updateDisplay();
    updateEquation();
}

function clearDisplay() {
    firstNumber = '';
    operator = '';
    secondNumber = '';
    displayValue = '';
    updateDisplay();
    updateEquation();
}

function updateDisplay() {
    // Show the complete current input including operator
    if (operator && !secondNumber) {
        display.value = firstNumber + ' ' + getOperatorSymbol(operator);
    } else if (operator && secondNumber) {
        display.value = secondNumber;
    } else {
        display.value = displayValue || '0';
    }
}

function playRandomFart() {
    const randomIndex = Math.floor(Math.random() * fartSounds.length);
    const fartAudio = new Audio(fartSounds[randomIndex]);
    
    // Add farting animation class
    const calculator = document.querySelector('.calculator');
    calculator.classList.add('farting');
    
    // Play the sound
    fartAudio.play();
    
    // Remove the animation class after animation completes
    setTimeout(() => {
        calculator.classList.remove('farting');
    }, 500);
}

function calculate(playSound = true) {
    if (firstNumber === '' || operator === '' || secondNumber === '') return;

    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(secondNumber);
    let result;

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num2 !== 0 ? num1 / num2 : 'Error';
            break;
    }

    // Play fart sound only when explicitly calculating (pressing equals)
    if (playSound) {
        playRandomFart();
    }

    // Update display and reset values
    displayValue = result.toString();
    firstNumber = result.toString();
    operator = '';
    secondNumber = '';
    updateDisplay();
    updateEquation();
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    // Prevent the default action for most calculator keys
    if (event.key.match(/[\d+\-*/.=Enter]/) || event.key === 'Backspace') {
        event.preventDefault();
    }

    // Handle numbers and decimal point
    if (event.key.match(/[\d.]/)) {
        appendNumber(event.key);
    }
    // Handle operators
    else if (event.key.match(/[+\-*/]/)) {
        setOperator(event.key);
    }
    // Handle equals and Enter
    else if (event.key === '=' || event.key === 'Enter') {
        calculate(true);
    }
    // Handle Escape for clear
    else if (event.key === 'Escape') {
        clearDisplay();
    }
    // Handle Backspace
    else if (event.key === 'Backspace') {
        handleBackspace();
    }
});

function handleBackspace() {
    if (secondNumber !== '') {
        secondNumber = secondNumber.slice(0, -1);
        displayValue = secondNumber;
    } else if (operator !== '') {
        operator = '';
    } else if (firstNumber !== '') {
        firstNumber = firstNumber.slice(0, -1);
        displayValue = firstNumber;
    }
    updateDisplay();
    updateEquation();
} 