class CalcController {

    constructor() {
        this._operation = [];
        this._locale = 'pt-br'
        this._displayCalcEl = document.querySelector('#display');
        this._DateEl = document.querySelector('#data');
        this._TimeEl = document.querySelector('#hora');
        this._currentDate;
        this.intialize();
        this.initButtonEvents()
    }

    intialize() {
        this.setDisplayDateTime()
        setInterval(()=>{
            this.setDisplayDateTime()
        1000
    })
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event=>{
            element.addEventListener(event,fn,false);
        })
    }

    clearAll() {
        this._operation = []
        this.SetLastNumberToDisplay()

    }

    clearEntry() {
        this._operation.pop()
        this.SetLastNumberToDisplay()
    }

    getLastOperation () {
        return this._operation[this._operation.length-1]
    }

    setLastOperation (value) {
        this._operation[this._operation.length - 1] = value
    }

    pushOperation (value) {
        this._operation.push(value)

        if(this._operation.length>3) {
            this.calc()
        }
    }

    calc() {
        let last = this._operation.pop()
        let result = eval(this._operation.join(""))
        if (last == '%') {
            result /= 100
            this._operation = [result]
        } else {
            
            this._operation = [result,last]
        }
        
        this.SetLastNumberToDisplay()
        console.log(this._operation)
    }

    isOperator (value) {
        return (['+', '-', '/', '*', '%'].indexOf(value) > -1) 
    }

    SetLastNumberToDisplay() {
        let lastNumber

        for(let i = this._operation.length-1; i>=0; i--){

            if (!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i]
                break;
            }
        }

        this.displayCalc = lastNumber
    }

    addOperation (value) {
        if(isNaN(this.getLastOperation())) {
            if(this.isOperator(value)) {
                this.setLastOperation(value)
            }
            else if (isNaN(value)) {
                console.log('outra coisa', value)
            }
            else {
                this.pushOperation(value)

                this.SetLastNumberToDisplay()
            }

        }
        else {
            if (this.isOperator(value)) {
                this.pushOperation(value)
            } else {
                let newValue = this.getLastOperation().toString()+value.toString()
                this.setLastOperation(parseInt(newValue))

                this.SetLastNumberToDisplay()
            }
        }
    }

    SetError() {
        this.displayCalc = 'ERROR';
    }

    execBtn(value) {
        switch(value) {
            case "ac":
                this.clearAll()
                break;
            case "ce":
                this.clearEntry()
                break;
            case "soma":
                this.addOperation('+');
                break;
            case "subtracao":
                this.addOperation('-');
                break;
            case "multiplicacao":
                this.addOperation('*');
                break;
            case "divisao":
                this.addOperation('/');
                break;
            case "igual":
                this.addOperation('=');
                break;
            case "porcento":
                this.addOperation('%');
                break;
            case "ponto":
                this.addOperation('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
            break;
            default:
                this.SetError()
            break;
        }
    }

    initButtonEvents() {
       let buttons = document.querySelectorAll('#buttons > g, #parts > g')

       buttons.forEach((btn, index)=>{

        this.addEventListenerAll(btn, 'click drag', e =>{  
            let textBtn = btn.className.baseVal.replace('btn-', '')
            this.execBtn(textBtn)
        })

        this.addEventListenerAll(btn,'mouseover mouseup mousedown', e=>{
            btn.style.cursor = 'pointer'
        })

       })
    }

    setDisplayDateTime () {
        this.displayDate = this.currentDate.toLocaleDateString(this.locale, {day: '2-digit', month: 'long' , year: 'numeric'})
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale)
    }

    get displayTime () {
        return this._TimeEl.innerHTML;
    }

    set displayTime(time) {
        this._TimeEl.innerHTML = time;
    }

    get displayDate () {
        return this._DateEl.innerHTML;
    }

    set displayDate(date) {
        this._DateEl.innerHTML = date
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(valor) {
        this._displayCalcEl.innerHTML = valor;
    }

    get currentDate() {
        return new Date;
    }

    set currentDate(data) {
        this._currentDate.innerHTML = data;
    }

}