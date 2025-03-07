const ERROR = "Error";

const OPERATIONS = {
  ADD: "add",
  SUBTRACT: "subtract",
  MULTIPLY: "multiply",
  DIVIDE: "divide",
};

const OPERATION_SYMBOLS = {
  [OPERATIONS.ADD]: " + ",
  [OPERATIONS.SUBTRACT]: " - ",
  [OPERATIONS.MULTIPLY]: " × ",
  [OPERATIONS.DIVIDE]: " ÷ ",
  default: "",
};

class Calculator {
  constructor(displayElement) {
    this.displayElement = displayElement;
    this.expression = "0";
    this.lastOperation = null;
    this.startNewNumber = true;
    this.calculationPerformed = false;
  }

  updateDisplay() {
    this.displayElement.textContent = this.currentValue;
  }

  clear() {
    this.expression = "0";
    this.lastOperation = null;
    this.startNewNumber = true;
    this.calculationPerformed = false;
    this.updateDisplay();
  }

  getOperatorSymbol(operator) {
    return OPERATION_SYMBOLS[operator] || OPERATION_SYMBOLS.default;
  }

  appendNumber(number) {
    // If a calculation was performed or we are just starting
    if (this.calculationPerformed || this.expression === "0") {
      this.expression = number;
      this.calculationPerformed = false;
    }

    // If we are adding a new operand to the expression
    if (this.startNewNumber) {
      this.expression += number;
      this.startNewNumber = false;
    }

    // Otherwise append to the current number
    else {
      // Check if the result of a previous calculation is displayed
      if (!!this.lastOperation && !this.expression.includes(" ")) {
        this.expression = number;
        this.lastOperation = null;
      } else {
        // Handle decimal point
        if (number === ".") {
          const partsOfExpression = this.expression.split(" ");
          const lastNumber = partsOfExpression[partsOfExpression.length - 1];

          if (lastNumber.includes(".")) return;
        }
      }
      this.expression += number;
    }

    this.updateDisplay();
  }

  backspace() {
    // If we have just calculated a result, clear it
    if (this.calculationPerformed) {
      this.clear();
      return;
    }
  }
}
