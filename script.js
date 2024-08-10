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
    'ln': (firstOperand) => Math.log(firstOperand),
    '!': (firstOperand) => {
        let result = 1;
        for (let i = 1; i <= firstOperand; i++) {
            result *= i;
        }
        return result;
    },
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

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
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
        result = inputValue * 0.0254; // Example conversion (inches to meters)
        resultElement.textContent = `${inputValue} inches = ${result.toFixed(2)} meters`;
    } else if (unitFrom === 'temperature') {
        result = (inputValue - 32) * 5 / 9; // Example conversion (Fahrenheit to Celsius)
        resultElement.textContent = `${inputValue} °F = ${result.toFixed(2)} °C`;
    }
}

document.querySelector('.calculator').addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) return;

    const value = target.value;

    if (target.classList.contains('operator')) {
        handleOperator(value);
        updateDisplay();
        return;
    }

    if (value === 'all-clear') {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (value === 'backspace') {
        backspace();
        updateDisplay();
        return;
    }

    if (target.classList.contains('memory')) {
        handleMemory(value);
        return;
    }

    if (value === '=') {
        handleOperator('=');
        updateDisplay();
        return;
    }

    if (target.classList.contains('mode-toggle')) {
        toggleMode();
        return;
    }

    if (target.classList.contains('theme-toggle')) {
        toggleTheme();
        return;
    }

    if (target.classList.contains('unit-converter-button')) {
        convertUnits();
        return;
    }

    if (value === '.') {
        inputDecimal(value);
        updateDisplay();
        return;
    }

    inputDigit(value);
    updateDisplay();
});

document.addEventListener('keydown', handleKeyboardShortcuts);

