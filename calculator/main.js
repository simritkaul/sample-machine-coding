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
    this.displayElement.textContent = this.expression;
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
    else if (this.startNewNumber) {
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

    // If only one char left or it says Error
    if (this.expression.length === 1 || this.expression === ERROR) {
      this.expression = "0";
    }

    // If the last thing was an operator
    else if (this.expression.endsWith(" ")) {
      this.expression = this.expression.slice(0, -3);
      this.startNewNumber = false; // We will go back to the number before the operator
    }

    // Otherwise just remove the last char
    else {
      this.expression = this.expression.slice(0, -1);
    }

    this.updateDisplay();
  }

  setOperation(operation) {
    // If just calculated, keep the result for the next operation
    if (this.calculationPerformed) {
      this.calculationPerformed = false;
    }

    // If the last thing was an operator, replace it
    if (this.expression.endsWith(" ")) {
      this.expression = this.expression.slice(0, -3);
    }

    const operationSymbol = this.getOperatorSymbol(operation);
    this.expression += operationSymbol;

    this.startNewNumber = true;
    this.updateDisplay();
  }

  negate() {
    // If we have calculated a result, negate the result
    if (this.calculationPerformed) {
      this.expression = (-parseFloat(this.expression)).toString();
      this.calculationPerformed = false;
      this.updateDisplay();
      return;
    }

    // If we are in the middle of an expression
    const partsOfExpression = this.expression.split(" ");
    const lastPart = partsOfExpression[partsOfExpression.length - 1];

    // If we haven't started a new number at the end of the expression
    if (!lastPart && partsOfExpression.length >= 2) {
      partsOfExpression[partsOfExpression.length - 1] = "-";
      this.startNewNumber = false;
    }

    // If the number already has a negative sign
    else if (lastPart.startsWith("-")) {
      partsOfExpression[partsOfExpression.length - 1] = lastPart.slice(1);
    }

    // Just add a negative sign
    else {
      partsOfExpression[partsOfExpression.length - 1] = "-" + lastPart;
    }

    this.expression = partsOfExpression.join(" ");
    this.updateDisplay();
  }

  percent() {}

  calculate() {
    // If we just calculated or if there is no expression
    if (this.calculationPerformed || !this.expression.includes(" ")) {
      return;
    }

    // Clean up the expression to solve it
    let evaluatingExpression = this.expression;

    evaluatingExpression = evaluatingExpression.replace(/×/g, "*");
    evaluatingExpression = evaluatingExpression.replace(/÷/g, "/");

    try {
      const result = eval(evaluatingExpression);

      // Format result to 6 decimal places
      this.expression = parseFloat(result.toFixed(6)).toString();
      this.lastOperation = "=";
      this.calculationPerformed = true;
    } catch (error) {
      this.expression = ERROR;
    }

    this.startNewNumber = true;
    this.updateDisplay();
  }
}

const handleCalculatorAction = (calculator, action) => {
  switch (action) {
    case "clear":
      console.log("Action: clear");
      calculator.clear();
      break;
    case "backspace":
      console.log("Action: backspace");
      calculator.backspace();
      break;
    case "negate":
      console.log("Action: negate");
      calculator.negate();
      break;
    case "percent":
      console.log("Action: percent");
      calculator.percent();
      break;
    case "calculate":
      console.log("Action: calculate");
      calculator.calculate();
      break;
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      console.log(`Action: ${action}`);
      calculator.setOperation(action);
      break;
    default:
      console.log("Action: unknown");
      break;
  }
};

const display = document.getElementById("display");
const calculator = new Calculator(display);

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.value) {
      calculator.appendNumber(button.dataset.value);
    } else if (button.dataset.action) {
      handleCalculatorAction(calculator, button.dataset.action);
    }
  });
});
