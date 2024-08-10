const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    history: [],
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

    if (operator && calculator.waitingForSecondOperand)  {
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
    '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.history = [];
    updateHistory();
}

function backspace() {
    const { displayValue } = calculator;
    calculator.displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function updateHistory() {
    const history = document.querySelector('.calculator-history');
    history.textContent = calculator.history.join(' | ');
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

    if (target.value === '.') {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

document.querySelectorAll('.calculator-keys button, .memory-keys button').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('pressed');
    });

    button.addEventListener('mouseup', () => {
        button.classList.remove('pressed');
    });
});

window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        inputDigit(key);
        updateDisplay();
        return;
    }

    if (key === '.') {
        inputDecimal(key);
        updateDisplay();
        return;
    }

    if (key === '=' || key === 'Enter') {
        handleOperator('=');
        updateDisplay();
        return;
    }

    if (key === 'Backspace') {
        backspace();
        updateDisplay();
        return;
    }

    if (key === 'Escape') {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key);
        updateDisplay();
    }
});
