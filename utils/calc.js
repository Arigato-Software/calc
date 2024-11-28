export class Calc {
    constructor() {
        this.expression = ""; // Строка для отображения выражения
        this.result = "";     // Строка для отображения результата
        this.currentInput = ""; // Текущее вводимое число
        this.replacement = false; // Флаг замены вводимого значения после выполнения унарной операции
        this.memory = "";    // Память калькулятора
    }

    trimTrailingZeros(numberString) {
        // Проверяем, является ли строка числом с дробной частью
        if (numberString.includes(".")) {
            // Удаляем все незначимые нули в конце дробной части
            numberString = numberString.replace(/\.?0+$/, "");
            if (numberString.endsWith(".")) numberString = numberString.slice(0, -1);
            if (parseFloat(numberString) == 0) value = "0";
        }
        return numberString;
    }

    getStringValue(value) {
        if (Math.abs(value) > 999999999999999) {
            return 'Overflow';
        }
        
        // Округляем результат до 14 значащих цифр
        if (value.toString().indexOf('e') > -1) {
            value = this.trimTrailingZeros(value.toFixed(13));
        } else if (Math.abs(value).toString().length > 15) {
            value = this.trimTrailingZeros(value.toPrecision(14));
            if (Math.abs(value).toString().length == 15){
                value = value.toString();
                // Исправляем неточность вычислений
                if (value.endsWith("01") || value.endsWith("02")){
                    for (let i = value.length - 2; i >= 0; i--){
                        if (!["-", ".", "0"].includes(value[i])){
                            value = value.slice(0, i + 1);
                            break;
                        }
                    }
                } else if (value.endsWith("9") || value.endsWith("98")){
                    for (let i = value.length - 2; i >= 0; i--){
                        if (!["-", ".", "9"].includes(value[i])){
                            value = value.slice(0, i) + (parseInt(value[i]) + 1).toString();
                            break;
                        }
                    }
                }
            }
        }
        return value.toString();
    }

    getCurrentInput() {
        const input = this.currentInput || this.result || "";
        return !isNaN(input) && input !== "" ? parseFloat(input) : "";
    }

    replaceValue(value) {
        this.currentInput = value;
        const lastNumberLength = this.expression.split(/\s+/).pop().length;
        if (lastNumberLength) {
            this.expression = this.expression.slice(0, -lastNumberLength);
        }
        this.expression += value;
    }

    // Метод MR (Memory Recall) — выводит значение из памяти в currentInput
    memoryRecall() {
        if (this.memory && !isNaN(this.memory)) {
            if (this.result) this.clear();
            this.replaceValue(this.memory);
            this.replacement = true;
        }
    }

    // Метод MS (Memory Store) — сохраняет текущий ввод в память
    memoryStore() {
        const input = this.getCurrentInput();
        if (input !== "") {
            this.memory = input.toString();
        }
    }

    // Метод MC (Memory Clear) — очищает память
    memoryClear() {
        this.memory = "";
    }

    // Метод M+ (Memory Add) — добавляет текущее значение в память
    memoryAdd() {
        const input = this.getCurrentInput();
        if (input !== "" && !isNaN(this.memory)) {
            const memory = this.memory ? parseFloat(this.memory) : 0;
            this.memory = this.getStringValue(memory + input);
        }
    }

    // Метод M- (Memory Subtract) — вычитает текущее значение из памяти
    memorySubtract() {
        const input = this.getCurrentInput();
        if (input !== "" && !isNaN(this.memory)) {
            const memory = this.memory ? parseFloat(this.memory) : 0;
            this.memory = this.getStringValue(memory - input);
        }
    }

    enterDigit(digit) {
        if (isNaN(this.currentInput) && this.currentInput !== "-" || isNaN(this.result)) return;
        if (this.result) this.clear();
        if (this.replacement){
            this.replaceValue(digit);
            this.replacement = false;
            return;
        }
        if (this.currentInput === "0" || this.currentInput === "-0") {
            this.backspace();
        }
        if (this.currentInput.length < 15 || this.currentInput.length < 16 && this.currentInput.startsWith("-")) {
            this.currentInput += digit;
            this.expression += digit;
        }
    }

    enterDecimal() {
        if (isNaN(this.currentInput) && this.currentInput !== "-" || isNaN(this.result)) return;
        if (this.result) this.clear();
        if (this.replacement){
            this.replaceValue("0.");
            this.replacement = false;
            return;
        }
        if (!this.currentInput.includes(".")) {
            if (!this.currentInput || this.currentInput === "-") {
                this.currentInput += "0";
                this.expression += "0";
            }
            this.currentInput += ".";
            this.expression += ".";
        }
    }

    toggleSign() {
        if (this.result) {
            if (isNaN(this.result)) return;
            this.result = this.result.startsWith("-")
                ? this.result.slice(1)
                : "-" + this.result;
            return;
        }
        if (this.currentInput) {
            if (isNaN(this.currentInput) && this.currentInput !== "-") return;
            // Меняем знак текущего числа
            this.currentInput = this.currentInput.startsWith("-")
                ? this.currentInput.slice(1)
                : "-" + this.currentInput;

            // Обновляем выражение
            this.replaceValue(this.currentInput);
        } else {
            // Если число еще не введено, добавляем "-" в currentInput и expression
            this.currentInput = "-";
            this.expression += "-";
        }
    }

    enterOperation(operation) {
        if (this.result) {
            if (isNaN(this.result)) return;
            this.currentInput = this.result;
            this.expression = this.result;
        } else {
            if (isNaN(this.currentInput)) return;
        }

        this.expression = this.expression.trimEnd();

        if (this.currentInput) {
            this.replaceValue(this.trimTrailingZeros(this.currentInput));
            this.expression += ` ${operation}`;
            this.currentInput = "";
        } else if (this.expression) {
            this.expression = this.expression.replace(/[\+\-\*\/%\^]$/, operation);
        }

        this.expression += " ";
        this.result = "";
        this.replacement = false;
    }

    // Метод для вычисления квадратного корня
    sqrt() {
        const value = this.getCurrentInput();
        if (value === "") return;
        const sqrtValue = value >= 0 ? this.getStringValue(Math.sqrt(value)) : "Error";
        if (this.currentInput) {
            this.replaceValue(sqrtValue);
        } else {
            this.result = sqrtValue;
        }
        this.replacement = true;
    }

    sqr() {
        const value = this.getCurrentInput();
        if (value === "") return;
        const sqrValue = this.getStringValue(value * value);
        if (this.currentInput) {
            this.replaceValue(sqrValue);
        } else {
            this.result = sqrValue;
        }
        this.replacement = true;
    }

    reciprocal() {
        const value = this.getCurrentInput();
        if (value === "") return;
        const reciprocalValue = value != 0 ? this.getStringValue(1 / value) : "Error";
        if (this.currentInput) {
            this.replaceValue(reciprocalValue);
        } else {
            this.result = reciprocalValue;
        }
        this.replacement = true;
    }

    // Метод для вычисления процента
    percent() {
        const value = this.getCurrentInput();
        if (value === "") return;

        let percentValue = 0;
        if (this.result) {
            percentValue = parseFloat(this.result) / 100;
        } else {
            const previous = this.getLastOperand();
            if (["+", "-"].includes(previous.operator)) {
                percentValue = (previous.value * parseFloat(this.currentInput)) / 100;
            } else {
                percentValue = parseFloat(this.currentInput) / 100;
            }
        }
        percentValue = this.getStringValue(percentValue);

        if (this.currentInput) {
            // Заменяем currentInput на вычисленный процент
            this.replaceValue(percentValue);
            this.replacement = true;
        } else {
            this.result = percentValue;
        }
    }

    getLastOperand() {
        const parts = this.expression.trim().split(/\s+/);
        let operator = "";
        for (let i = parts.length - 2; i >= 0; i--) {
            if (!isNaN(parts[i])) {
                return { value: parseFloat(parts[i]), operator: operator };
            } else {
                operator = parts[i];
            }
        }
        return { value: 0, operator: operator }; // Если предыдущего числа нет, возвращаем 0
    }

    calculate() {
        try {
            if (isNaN(this.result) || isNaN(this.currentInput)) {
                return;
            }
            if (this.expression) {
                if (!this.currentInput) {
                    if (this.result) {
                        const tokens = this.expression.split(/\s+/);
                        if (tokens.length >= 4) {
                            tokens.pop();
                            const b = tokens.pop();
                            const op = tokens.pop();
                            this.expression = `${this.result} ${op} ${b}`;
                        } else {
                            this.expression = this.result;
                        }
                    } else {
                        this.expression = this.expression.replace(/\s[\+\-\*\/%\^]\s$/, "");
                    }
                } else {
                    this.replaceValue(this.trimTrailingZeros(this.currentInput));
                }
                this.expression += " =";
                this.result = this.getStringValue(this.evaluateExpression(this.expression));
            }
        } catch (error) {
            this.result = "Error";
        }
        this.currentInput = "";
        this.replacement = false;
    }

    // Метод для сброса
    clear() {
        this.expression = "";
        this.result = "";
        this.currentInput = "";
        this.replacement = false;
    }

    lastOperand() {
        // Удаляем пробелы в конце выражения
        this.expression = this.expression.trimEnd();

        this.expression = this.expression.slice(0, -1).trimEnd();
        const tokens = this.expression.split(/\s+/);
        this.currentInput = tokens.pop(); // Последний операнд

        // Очищаем результат
        this.result = "";
    }

    // Метод для стирания последней введенной цифры
    backspace() {
        if (this.currentInput) {
            if (isNaN(this.currentInput) || this.replacement) {
                this.clearLastNumber();
                this.replacement = false;
                return;
            }
            // Удаляем последнюю цифру из currentInput
            this.currentInput = this.currentInput.slice(0, -1);

            // Обновляем выражение, удаляя последнюю цифру
            this.expression = this.expression.slice(0, -1);
        } else {
            this.lastOperand();
        }
    }

    // Метод для удаления последнего введенного числа целиком
    clearLastNumber() {
        // Если число существует, удаляем его
        if (this.currentInput) {
            // Удаляем последнее число из выражения
            this.expression = this.expression.slice(0, -this.currentInput.length);
            // Очищаем currentInput
            this.currentInput = "";
        } else {
            this.lastOperand();
        }
        this.replacement = false;
    }

    evaluateExpression(expr) {
        const tokens = expr.split(/\s+/);
        const values = [];
        const operators = [];

        const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 3 };

        const applyOperator = () => {
            const b = values.pop();
            const a = values.pop();
            const op = operators.pop();
            let value = NaN;
            switch (op) {
                case "+": value = a + b; break;
                case "-": value = a - b; break;
                case "*": value = a * b; break;
                case "/":
                    if (b === 0) throw new Error("Error");
                    value = a / b;
                    break;
                case "%":
                    if (b === 0) throw new Error("Error");
                    value = a % b;
                    break;
                case "^": value = Math.pow(a, b); break;
            }
            if (isNaN(value)) throw new Error("Error");
            values.push(value);
        };

        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                values.push(parseFloat(token));
            } else if (["+", "-", "*", "/", "%", "^"].includes(token)) {
                while (
                    operators.length &&
                    precedence[operators[operators.length - 1]] >= precedence[token]
                ) {
                    applyOperator();
                }
                operators.push(token);
            }
        }

        while (operators.length) {
            applyOperator();
        }

        return values[0];
    }
}
