class CalcController {
  constructor() {
    this._lastOperator = "";
    this._lastNumber = "";
    this._operation = [];
    this._locale = "pt-br";
    this._displayCalcEl = document.querySelector("#display");
    this._DateEl = document.querySelector("#data");
    this._TimeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonEvents();
    this.initKeyboard();
    this.pasteFromClipBoard();
  }

  pasteFromClipBoard() {
    document.addEventListener("paste", (e) => {
      let Text = e.clipboardData.getData("Text");
      this.displayCalc = parseFloat(Text);
      console.log(Text);
    });
  }

  copyToClipboard() {
    let input = document.createElement("input");

    input.value = this.displayCalc;

    document.body.appendChild(input);

    input.select();

    documento.execCommando("Copy");

    input.remove();
  }

  initialize() {
    this.setDisplayDateTime();
    setInterval(() => {
      this.setDisplayDateTime();
      1000;
    });
  }

  initKeyboard() {
    document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "Escape":
          this.clearAll();
          break;
        case "Backspace":
          this.clearEntry();
          break;
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          this.addOperation(e.key);
          break;
        case "Enter":
        case "=":
          this.calc();
          break;
        case ".":
        case ",":
          this.addDot();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addOperation(parseInt(e.key));
          break;
        case "c":
          if (e.ctrlKey) this.copyToClipboard();
          break;
      }
    });
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
    this._lastNumber = "";
    this._lastOperator = "";
    this.SetLastNumberToDisplay();
  }

  clearEntry() {
    this._operation.pop();
    this.SetLastNumberToDisplay();
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  getResult() {
    try {
      return eval(this._operation.join(""));
    } catch (e) {
      setTimeout(() => {
        1;
        this.SetError();
      });
    }
  }

  calc() {
    let last = "";

    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();

      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();

    if (last == "%") {
      result /= 100;
      this._operation = [result];
    } else {
      this._operation = [result];

      if (last) this._operation.push(last);
    }

    this.SetLastNumberToDisplay();
  }

  isOperator(value) {
    return ["+", "-", "/", "*", "%"].indexOf(value) > -1;
  }

  getLastItem(isOperator = true) {
    let lastItem;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      lastItem = isOperator ? this._lastOperator : this._lastNumber;
    }

    return lastItem;
  }

  SetLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false);

    if (!lastNumber) lastNumber = 0;

    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);

        this.SetLastNumberToDisplay();
      }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);

        this.SetLastNumberToDisplay();
      }
    }
  }

  SetError() {
    this.displayCalc = "ERROR";
  }

  addDot() {
    let lastOperation = this.getLastOperation();

    if (
      typeof lastOperation == "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }

    this.SetLastNumberToDisplay();
  }

  execBtn(value) {
    switch (value) {
      case "ac":
        this.clearAll();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "soma":
        this.addOperation("+");
        break;
      case "subtracao":
        this.addOperation("-");
        break;
      case "multiplicacao":
        this.addOperation("*");
        break;
      case "divisao":
        this.addOperation("/");
        break;
      case "igual":
        this.calc();
        break;
      case "porcento":
        this.addOperation("%");
        break;
      case "ponto":
        this.addDot();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseFloat(value));
        break;
      default:
        this.SetError();
        break;
    }
  }

  initButtonEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, "click drag", (e) => {
        let textBtn = btn.className.baseVal.replace("btn-", "");
        this.execBtn(textBtn);
      });

      this.addEventListenerAll(btn, "mouseover mouseup mousedown", (e) => {
        btn.style.cursor = "pointer";
      });
    });
  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this.locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
  }

  get displayTime() {
    return this._TimeEl.innerHTML;
  }

  set displayTime(time) {
    this._TimeEl.innerHTML = time;
  }

  get displayDate() {
    return this._DateEl.innerHTML;
  }

  set displayDate(date) {
    this._DateEl.innerHTML = date;
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(valor) {
    if (valor.toString().length > 10) {
      this.SetError();
      return false;
    }

    this._displayCalcEl.innerHTML = valor;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(data) {
    this._currentDate.innerHTML = data;
  }
}
