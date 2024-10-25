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
    "cursor": [0, -1, 1],
    "encoding": "0123456789()^*/+-=".split("").concat(["FRACTION", "SOLVE", "DELETE", "CLEAR", "LEFT", "RIGHT"]),
    "move": (direction) => {

        let end = KEYBOARD.cursor.length - 1;
        KEYBOARD.cursor[end] += direction;
        
        if (KEYBOARD.cursor[end] === 0) {
            KEYBOARD.cursor[end] = 1;
            KEYBOARD.cursor[end - 1] -= 1;
        }
        
        let expression = KEYBOARD.equation[KEYBOARD.cursor[0]];
        
        if (KEYBOARD.cursor[end] > expression.get(KEYBOARD.cursor.slice(1))) {
            
        }

        if (KEYBOARD.cursor[end - 1] < -1) {
            KEYBOARD.cursor[end - 1] = -1;
        }
    },
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

        
        let expression = KEYBOARD.equation[KEYBOARD.cursor[0]];
        

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
            if (cursor === undefined || cursor instanceof Operation) {
                expression.add(new SimpleFraction(key));
                KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 1;
            }
            
            //Is a SimpleFraction
            else if (cursor instanceof SimpleFraction) {
                let value = cursor.toString().split("")
                value.splice([location[depth + 1]], 0, key)
                value = value.join("")

                expression.value[location[depth]] = new SimpleFraction(value);
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] += 1;
            }

            else if (cursor instanceof Expression) {
                KEYBOARD.press(13);
                KEYBOARD.press(Number(type));
            }

        }

        else if (type <= 11) { //Expression
            if (type === 10) {
                if (cursor == undefined) {
                    expression.add(new Expression());
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 1] += -1;
                    KEYBOARD.cursor.push(0);
                }
    
                else if (cursor instanceof SimpleFraction) {
                    KEYBOARD.press(13);
                    KEYBOARD.press(10);
                }
    
                else if (cursor instanceof Operation) {
                    expression.add(new Expression());
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                    KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 0;
                    KEYBOARD.cursor.push(0);
                }
            }

            else if (type === 11) {
                KEYBOARD.cursor.pop();
                //KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 0;
            }

            else {
                console.error("Massive Error");
            }
        }

        else if (type <= 16) { //Operation
            
            if (cursor === undefined || cursor instanceof SimpleFraction || cursor instanceof Expression) {
                expression.add(new Operation(key));
                KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
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
                    document.getElementById("console").value = solve(KEYBOARD.equation[0]);
                    break;
                
                case 20: //Delete

                    break;
                
                case 21: //Clear
                    KEYBOARD.equation.forEach((e) => { e.value = [] });
                    KEYBOARD.cursor = [0, 0, 0];
                    break;
                
                case 22: //move left
                case 23: //move right
                    let direction = (type - 22) * 2 - 1
                    KEYBOARD.move(direction);
                    break;

                default:
                    console.error("Massive Error")
                    break;
            }
        }

        output(KEYBOARD.equation[0].toString());
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