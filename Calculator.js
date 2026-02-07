const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";
let currentValue = "";

const operators = ["+", "-", "*", "/"];

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (value === "C") {
            clearDisplay();
        } else if (value === "=") {
            calculate();
        } else {
            appendValue(value);
        }
    });
});

function appendValue(value) {

    if (operators.includes(value)) {
        if (currentValue === "") return;

        expression += currentValue + value;
        currentValue = "";
        display.value = "";
        return;
    }

    if (currentValue.length >= 11) return;

    currentValue += value;
    display.value = currentValue;
}

function clearDisplay() {
    expression = "";
    currentValue = "";
    display.value = "";
}

function calculate() {
    try {
        const fullExpression = expression + currentValue;

        if (fullExpression.includes("/0")) {
            display.value = "Error";
            expression = "";
            currentValue = "";
            return;
        }

        const result = safeCalculate(fullExpression);
        display.value = result;

        expression = "";
        currentValue = result;

    } catch {
        display.value = "Error";
        expression = "";
        currentValue = "";
    }
}

document.addEventListener("keydown", e => {
    const key = e.key;

    if (!isNaN(key) || key === ".") {
        appendValue(key);
    }

    if (operators.includes(key)) {
        appendValue(key);
    }

    if (key === "Enter") {
        calculate();
    }

    if (key === "Escape") {
        clearDisplay();
    }

    if (key === "Backspace") {
        currentValue = currentValue.slice(0, -1);
        display.value = currentValue;
    }
});

function safeCalculate(exp) {

    let tokens = exp.split(/([+\-*/])/);

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "*" || tokens[i] === "/") {

            const result =
                tokens[i] === "*"
                    ? Number(tokens[i - 1]) * Number(tokens[i + 1])
                    : Number(tokens[i - 1]) / Number(tokens[i + 1]);

            tokens.splice(i - 1, 3, result.toString());
            i--;
        }
    }

    let finalResult = Number(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === "+") finalResult += Number(tokens[i + 1]);
        if (tokens[i] === "-") finalResult -= Number(tokens[i + 1]);
    }

    return finalResult.toString();
}

