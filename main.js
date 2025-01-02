/*
To Do:
 - ComplexFraction's
 - Delete Key
 - Design and stuff
*/

document.querySelectorAll('button').forEach(button => {
    button.setAttribute('tabindex', '-1');
});

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

EQUATION = [new Expression(), new Expression()]

KEYBOARD = {
    "cursor": [0, 0, 0],
    "encoding": "0123456789()^*/+-=".split("").concat(["FRACTION", "SOLVE", "DELETE", "CLEAR", "LEFT", "RIGHT"]),
    "press": (event) => {
        let key, type;

        if (typeof event === "number") {
            type = event;
            key = KEYBOARD.encoding[type];
        }

        else {
            key = event.srcElement.dataset.value;
            type = KEYBOARD.encoding.findIndex((element) => element === key);
        }
        
        let expression = EQUATION[KEYBOARD.cursor[0]];
        

        let location = KEYBOARD.cursor.slice(1);
        let depth = location.length - 2;

        for (let i = 0; i < depth; i++) {
            expression = expression.value[location[i]];
        }

        let cursor = expression.value[location[depth]];

        if (type == -1) {
            console.error(`"${key}" is not a valid key.`);
        }

        else if (type <= 9) { //SimpleFraction press

            //Operation or Undefined
            if (cursor === undefined || cursor instanceof Operation) {
                expression.add(new SimpleFraction(key));
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 1;
                
                cursor === undefined ? null :
                KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1; //Operation only
            }
            
            //SimpleFraction
            else if (cursor instanceof SimpleFraction) {
                let value = cursor.toString();
                let newValue = value.slice(0, location[depth + 1]) + key + value.slice(location[depth + 1]);
                expression.value[location[depth]] = new SimpleFraction(newValue);
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] += 1;
            }

            //Expression
            else if (cursor instanceof Expression) {
                KEYBOARD.press(13);
                KEYBOARD.press(Number(type));
            }

        }

        else if (type <= 11) { //Expression press
            if (type === 10) {
                if (cursor == undefined) {
                    expression.add(new Expression());
                    KEYBOARD.cursor.push(0);
                }

                else if (cursor instanceof SimpleFraction) {
                    KEYBOARD.press(13); // press Operation [Multiplication]
                    KEYBOARD.press(10); // press Expression [Open Parenthesis]
                }

                else if (cursor instanceof Operation) {
                    expression.add(new Expression());
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 0;
                    KEYBOARD.cursor.push(0);
                }
            }

            else if (type === 11 && KEYBOARD.cursor.length > 3) {
                KEYBOARD.cursor.pop();
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 0;
            }
        }

        else if (type <= 16) { //Operation
            
            if ((cursor === undefined && [15, 16].includes(type)) || cursor instanceof SimpleFraction || cursor instanceof Expression) {
                expression.add(new Operation(key));
                cursor === undefined ? null : KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 1;
            }

            else if (cursor instanceof Operation) {
                console.error("Cursor on Cursor has not been implemented (yet)")
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
                    document.getElementById("console").value = solve(EQUATION[0]);
                    break;
                
                case 20: //Delete

                    break;
                
                case 21: //Clear
                    EQUATION.forEach((e) => { e.value = [] });
                    KEYBOARD.cursor = [0, 0, 0];
                    break;
                
                case 22: //move left
                    break;
                
                case 23: //move right
                    break;

                default:
                    console.error("Massive Error")
                    break;
            }
        }

        output(EQUATION[0].toString());
    }
}

KEYS.forEach(button => button.addEventListener("click", KEYBOARD.press));


addEventListener("keyup", event => {
    let button = KEYS.filter(element => element.dataset.keycode === event.key);
    button.forEach(button => button.click());
})

_cursor = document.getElementById("cursor");
setInterval(() => {
    _cursor.value = String(KEYBOARD.cursor)
}, 100)