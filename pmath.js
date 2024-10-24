class Expression {
    constructor(json = null) {
        this.name = "Expression"

        if (json !== null) {
            let value = JSON.parse(json);
            value = value.map(element => {
                switch (element.name) {
                    case "Operation":
                        return new Operation(element.type);
                    
                    case "SimpleFraction":
                        return new SimpleFraction(element.numerator, element.denominator);
                    
                    case "ComplexFraction":
                        return new ComplexFraction(element.numerator, element.denominator);
                    
                    case "Expression":
                        return new Expression(JSON.stringify(element.value));
                    
                    default:
                        return "Error";
                }
            });

            this.value = value;
        } else {
            this.value = [];
        }
    }
    
    push(...element) {
        element.forEach(element => this.value.push(element));
    }
    
    copy() { return new Expression(this.json()); }
    
    json() {
        return JSON.stringify(this.value);
    }

    toString(toplevel = true) {
        let result = "";
        this.value.forEach(element => result += element.toString(false));

        return toplevel ? result : "(" + result + ")";
    }

    next() {
        let index = this.value.findIndex(element => element instanceof Expression);

        if (index !== -1) {
            let result = [index];
            let expression = this.value[index];
            result = result.concat(expression.next());

            return result;
        }

        ////Exponents (Not Implented)
        //index = this.value.findIndex(element => element instanceof Operation && element.type === 4);
        //if (index !== -1) { return [index]; }
        
        //Multiplication x Division
        index = this.value.findIndex(element => element instanceof Operation && element.type >= 2);
        if (index !== -1) { return [index]; }

        //Addition x Subtraction
        index = this.value.findIndex(element => element instanceof Operation);
        if (index !== -1) { return [index]; }

        //Null Operation (When there is a single term in a parenthesis)
        if (this.value.length === 1) { return []; }
    }

    step() {
        let location = this.next();
        let depth = location.length - 1;
        let parent = this;

        if (depth === -1) {
            return this.toString();
        }

        //get to the "lowest" parenthesis
        for (let i = 0; i < depth; i++) {
            parent = parent.value[location[i]];
        }

        let operation = parent.value[location[depth]];

        //Null Operation
        if (operation.name === "Expression") {
            parent.value[location[depth]] = operation.value[0];
            return this.toString();
        }

        let x = parent.value[location[depth] - 1];
        let y = parent.value[location[depth] + 1];

        let result;

        switch (operation.type) {
            case 0: //Addition
                result = x.add(y);
                break;
            
            case 1: //Subtraction
                result = x.sub(y);
                break;
            
            case 2: //Multiplication
                result = x.mul(y);
                break;
            
            case 3: //Division
                result = x.div(y);
                break;

            case 4: //Exponent (Not Implmented)
                break;
                result = x ** y;
        
            default:
                break;
        }

        parent.value.splice(location[depth] - 1, 2);
        parent.value[location[depth] - 1] = new SimpleFraction(result);

        return this.toString();
    }
}

class Operation {
    static encoding = ["+", "-", "*", "/", "^"]

    constructor(type) {
        this.name = "Operation"
        if (typeof type === "string") {
            this.type = Operation.encoding.indexOf(type);
        } else {
            this.type = type;
        }
    }

    toString() { return " " + Operation.encoding[this.type] + " "; }
}

class SimpleFraction {
    constructor(numerator, denominator = 1) {
        this.name = "SimpleFraction";
        this.numerator = Number(numerator);
        this.denominator = Number(denominator);
    }

    toString() { return String(this.numerator / this.denominator); }

    add(fraction) {
        let x = this.simplify(false);
        let y = fraction.simplify(false);

        let numerator = x.numerator * y.denominator + y.numerator * x.denominator;
        let denominator = x.denominator * y.denominator;

        return new SimpleFraction(numerator, denominator).simplify();
    }

    sub(fraction) {
        let x = this.simplify(false);
        let y = fraction.simplify(false);

        let numerator = x.numerator * y.denominator - y.numerator * x.denominator;
        let denominator = x.denominator * y.denominator;

        return new SimpleFraction(numerator, denominator).simplify();
    }

    mul(fraction) {
        let x = this.simplify(false);
        let y = fraction.simplify(false);

        let numerator = x.numerator * y.numerator;
        let denominator = x.denominator * y.denominator;

        return new SimpleFraction(numerator, denominator).simplify();
    }

    div(fraction) {
        let x = this.simplify(false);
        let y = fraction.simplify(false);

        let numerator = this.numerator * fraction.denominator;
        let denominator = this.denominator * fraction.numerator;

        return new SimpleFraction(numerator, denominator).simplify();
    }

    exp(fraction) {
        let x = this.simplify(false);
        let y = fraction.simplify(false);

        let numerator = (x.numerator ** y.numerator / y.denominator);
        let denominator = (x.denominator ** y.numerator / y.denominator);

        return new SimpleFraction(numerator, denominator).simplify();
    }

    simplify(save = true) {
        
        while (!Number.isInteger(this.numerator) || !Number.isInteger(this.denominator)) {
            this.numerator *= 10
            this.denominator *= 10
        }

        let gcd = PMath.gcd(this.numerator, this.denominator);
        
        if (save) {
            this.numerator /= gcd;
            this.denominator /= gcd;
            return this;
        } 

        let result = new SimpleFraction(this.numerator / gcd, this.denominator / gcd);
        return result;
    }
}

class ComplexFraction {
    constructor(numerator, denominator) {
        this.name = "ComplexFraction";
        this.numerator = new Expression(numerator);
        this.denominator = new Expression(denominator);
    }

    toString() { return `(${this.numerator} / ${this.denominator})`; }
}


const PMath = {
    gcd(a, b) {
        if (a <= 0 || b <= 0) {
            return 1;
        }
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    },
    lcm(a, b) {
        if (a <= 0 || b <= 0) {
            return null;
        }
        return (a * b) / PMath.gcd(a, b);
    }
}
