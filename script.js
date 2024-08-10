const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    history: [],
    memory: 0,
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = String(result);
        calculator.firstOperand = result;
        calculator.history.push(`${firstOperand} ${operator} ${inputValue} = ${result}`);
        updateHistory();
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand,
    'sqrt': (firstOperand) => Math.sqrt(firstOperand),
    'pow': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
    'sin': (firstOperand) => Math.sin(firstOperand),
    'cos': (firstOperand) => Math.cos(firstOperand),
    'tan': (firstOperand) => Math.tan(firstOperand),
    'log': (firstOperand) => Math.log10(firstOperand),
    'exp': (firstOperand) => Math.exp(firstOperand),
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateHistory();
}

function backspace() {
    const { displayValue } = calculator;
    calculator.displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
}

function handleMemory(operation) {
    const value = parseFloat(calculator.displayValue);

    if (operation === 'M+') {
        calculator.memory += value;
    } else if (operation === 'M-') {
        calculator.memory -= value;
    } else if (operation === 'MR') {
        calculator.displayValue = String(calculator.memory);
    } else if (operation === 'MC') {
        calculator.memory = 0;
    }
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function updateHistory() {
    const history = document.querySelector('.calculator-history');
    history.textContent = calculator.history.join(' | ');
}

function toggleMode() {
    document.querySelector('.basic-mode').classList.toggle('hidden');
    document.querySelector('.scientific-mode').classList.toggle('hidden');
    const modeButton = document.querySelector('.mode-toggle');
    modeButton.textContent = modeButton.textContent === 'Basic' ? 'Scientific' : 'Basic';
}

function handleKeyboardShortcuts(event) {
    const key = event.key;
    switch (key) {
        case 's':
            if (event.ctrlKey) {
                handleOperator('sqrt');
                updateDisplay();
            }
            break;
        case 'p':
            if (event.ctrlKey) {
                handleOperator('pow');
                updateDisplay();
            }
            break;
        case 'l':
            if (event.ctrlKey) {
                handleOperator('log');
                updateDisplay();
            }
            break;
        case 'e':
            if (event.ctrlKey) {
                handleOperator('exp');
                updateDisplay();
            }
            break;
        case 'a':
            if (event.ctrlKey) {
                handleOperator('+');
                updateDisplay();
            }
            break;
        case 'm':
            if (event.ctrlKey) {
                handleOperator('-');
                updateDisplay();
            }
            break;
        case 'x':
            if (event.ctrlKey) {
                handleOperator('*');
                updateDisplay();
            }
            break;
        case '/':
            handleOperator('/');
            updateDisplay();
            break;
    }
}

function convertUnits() {
    const unitFrom = document.getElementById('unit-from').value;
    const inputValue = parseFloat(document.getElementById('unit-input').value);
    const resultElement = document.getElementById('conversion-result');
    
    let result;

    if (unitFrom === 'length') {
        result = inputValue * 100; // Example conversion: meters to centimeters
        resultElement.textContent = `${inputValue} meters is ${result} centimeters`;
    } else if (unitFrom === 'temperature') {
        result = (inputValue * 9/5) + 32; // Example conversion: Celsius to Fahrenheit
        resultElement.textContent = `${inputValue} Celsius is ${result} Fahrenheit`;
    }
}

updateDisplay();
updateHistory();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('backspace')) {
        backspace();
        updateDisplay();
        return;
    }

    if (target.classList.contains('memory')) {
        handleMemory(target.value);
        updateDisplay();
        return;
    }

    if (target.value === '.') {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

document.querySelector('.mode-toggle').addEventListener('click', toggleMode);

document.querySelector('.history-clear').addEventListener('click', () => {
    calculator.history = [];
    updateHistory();
});

document.getElementById('convert-button').addEventListener('click', convertUnits);

document.querySelectorAll('.calculator-keys button, .memory-keys button').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('pressed');
    });

    button.addEventListener('mouseup', () => {
        button.classList.remove('pressed');
    });
});

window.addEventListener('keydown', (event) => {
    handleKeyboardShortcuts(event);
});
