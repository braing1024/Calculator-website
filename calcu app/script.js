class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.expression = '';
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn-number').forEach(button => {
            button.addEventListener('click', () => {
                this.handleNumber(button.dataset.number);
                this.animateButton(button);
            });
        });
        
        // Operator buttons
        document.querySelectorAll('.btn-operator').forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperator(button.dataset.operator);
                this.animateButton(button);
            });
        });
        
        // Equals button
        document.querySelector('.btn-equals').addEventListener('click', () => {
            this.handleEquals();
            this.animateButton(document.querySelector('.btn-equals'));
        });
        
        // Clear button
        document.querySelector('.btn-clear').addEventListener('click', () => {
            this.handleClear();
            this.animateButton(document.querySelector('.btn-clear'));
        });
        
        // Decimal button
        document.querySelector('.btn-decimal').addEventListener('click', () => {
            this.handleDecimal();
            this.animateButton(document.querySelector('.btn-decimal'));
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    handleNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }
        
        if (this.currentInput === '0') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }
        
        this.updateDisplay();
    }
    
    handleOperator(operator) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const result = this.calculate();
            this.currentInput = String(result);
            this.previousInput = result;
            this.updateDisplay();
        }
        
        this.shouldResetDisplay = true;
        this.operator = operator;
        this.updateExpression();
        this.updateActiveOperator();
    }
    
    handleEquals() {
        if (this.operator && this.previousInput !== '') {
            const result = this.calculate();
            this.currentInput = String(result);
            this.previousInput = '';
            this.operator = null;
            this.expression = '';
            this.shouldResetDisplay = true;
            this.updateDisplay();
            this.updateActiveOperator();
            this.animateResult();
        }
    }
    
    handleClear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.expression = '';
        this.shouldResetDisplay = false;
        this.updateDisplay();
        this.updateActiveOperator();
    }
    
    handleDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
            this.updateDisplay();
        }
    }
    
    calculate() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return current;
        
        switch (this.operator) {
            case '+':
                return prev + current;
            case '-':
                return prev - current;
            case '*':
                return prev * current;
            case '/':
                return current !== 0 ? prev / current : 0;
            default:
                return current;
        }
    }
    
    updateDisplay() {
        const resultElement = document.getElementById('result');
        const formattedValue = this.formatNumber(this.currentInput);
        resultElement.textContent = formattedValue;
    }
    
    updateExpression() {
        const expressionElement = document.getElementById('expression');
        if (this.operator && this.previousInput !== '') {
            const formattedPrev = this.formatNumber(String(this.previousInput));
            const operatorSymbol = this.getOperatorSymbol(this.operator);
            this.expression = `${formattedPrev} ${operatorSymbol}`;
            expressionElement.textContent = this.expression;
        } else {
            expressionElement.textContent = '';
        }
    }
    
    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }
    
    formatNumber(num) {
        const number = parseFloat(num);
        if (isNaN(number)) return '0';
        
        // Format large numbers with commas
        if (number.toString().length > 12) {
            return number.toExponential(6);
        }
        
        // Format with commas for readability
        return number.toLocaleString('en-US', {
            maximumFractionDigits: 10,
            useGrouping: true
        });
    }
    
    updateActiveOperator() {
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (this.operator) {
            const activeBtn = document.querySelector(`[data-operator="${this.operator}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }
    }
    
    animateButton(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 200);
    }
    
    animateResult() {
        const resultElement = document.getElementById('result');
        resultElement.classList.add('updated');
        setTimeout(() => {
            resultElement.classList.remove('updated');
        }, 300);
    }
    
    handleKeyboard(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            this.handleNumber(key);
            const button = document.querySelector(`[data-number="${key}"]`);
            if (button) this.animateButton(button);
        } else if (key === '.') {
            this.handleDecimal();
            const button = document.querySelector('.btn-decimal');
            if (button) this.animateButton(button);
        } else if (key === '+' || key === '-') {
            this.handleOperator(key);
            const button = document.querySelector(`[data-operator="${key}"]`);
            if (button) this.animateButton(button);
        } else if (key === '*') {
            this.handleOperator('*');
            const button = document.querySelector(`[data-operator="*"]`);
            if (button) this.animateButton(button);
        } else if (key === '/') {
            event.preventDefault();
            this.handleOperator('/');
            const button = document.querySelector(`[data-operator="/"]`);
            if (button) this.animateButton(button);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.handleEquals();
            const button = document.querySelector('.btn-equals');
            if (button) this.animateButton(button);
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.handleClear();
            const button = document.querySelector('.btn-clear');
            if (button) this.animateButton(button);
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

