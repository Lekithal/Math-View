/*
To Do:
 - ComplexFraction's
 - Delete Key
 - Design and stuff
*/

output = (input) => { document.getElementById("output").value = input; }


function solve(expression) {
    let result = "";
    let log = (t1 = "", t2 = "") => {
        result += t1 + " " + t2 + "\n";
    }

    let copy = expression.copy();

    log("Problem:", copy.toString());
    log();
    log("Solution:");
    log("0:", copy.toString());

    let steps = 1;
    while (copy.next().length !== 0) {
        log(`${steps}:`, copy.step());
        steps++;
    }

    return result;
}


KEYS = Array.from(document.getElementById("keyboard").children);

KEYBOARD = {
    "equation": [new Expression(), new Expression()],
    "cursor": [0, 0, 0],
    "encoding": "0123456789()^*/+-=".split("").concat(["FRACTION", "SOLVE", "DELETE", "CLEAR"]),
    "move": () => {},
    "press": (event) => {
        let key = event.srcElement.dataset.value;
        let type = KEYBOARD.encoding.findIndex((element) => element === key);

        let expression = KEYBOARD.equation[KEYBOARD.cursor[0]]
        

        let location = KEYBOARD.cursor.slice(1);
        let depth = location.length - 2;

        for (let i = 0; i < depth; i++) {
            expression = expression.value[location[i]];
        }

        let cursor = expression.value[location[depth]];

        if (type == -1) {
            console.error(`"${key}" is not a valid key.`);
        }

        else if (type <= 9) { //SimpleFraction

            //First element in that expression
            if (cursor === undefined) {
                expression.push(new SimpleFraction(key));
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] += 1;
            }
            
            //Is a SimpleFraction
            else if (cursor instanceof SimpleFraction) {
                let value = cursor.toString().split("")
                value.splice([location[depth + 1]], 0, key)
                value = value.join("")

                expression.value[location[depth]] = new SimpleFraction(value);
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] += 1;
            }

            else if (cursor instanceof Operation) {
                expression.push(new SimpleFraction(key));
                KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 1;
            }

        }

        else if (type <= 11) { //Expression
            if (type === 10) {
                if (cursor == undefined) {
                    expression.push(new Expression());
                    KEYBOARD.cursor.push(0);
                }
    
                else if (cursor instanceof SimpleFraction) {
                    
                }
    
                else if (cursor instanceof Operation) {
                    expression.push(new Expression());
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 0;
                    KEYBOARD.cursor.push(0);
                }
            }

            else if (type === 11) {
                KEYBOARD.cursor.pop();
                KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 0;
            }

            else {
                console.error("What the fuck");
            }
        }

        else if (type <= 16) { //Operation
            
            if (cursor === undefined || cursor instanceof SimpleFraction) {
                expression.push(new Operation(key));
                KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 1;
            }

            else {
                console.error("Unknown element on cursor.");
            }
        }

        else {
            switch (type) {
                case 18: //ComplexFraction
    
                    break;
                
                case 19: //Solve
                    document.getElementById("console").value = solve(KEYBOARD.equation[0]);
                    break;
                
                case 20: //Delete
    
                    break;
                
                case 21: //Clear
                    KEYBOARD.equation.forEach((e) => { e.value = [] });
                    break;
            
                default:
                    console.error("bruh")
                    break;
            }
        }

        output(KEYBOARD.equation[0].toString());
    }
}

KEYS.forEach(button => button.addEventListener("click", KEYBOARD.press));


addEventListener("keyup", event => {
    let button = KEYS.filter(element => element.dataset.keycode === event.key);
    button.forEach(button => {
        button.click();
        console.log(button.dataset.value);
    });
})
