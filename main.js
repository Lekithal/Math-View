/*
To Do:
 - Keyboard Support
 - Floating Point Precision Error
 - ComplexFraction's
 - Design and stuff
*/

output = (input) => { document.getElementById("output").value = input; }


function solve(expression) {

    let copy = expression.copy();

    console.log("Problem:", copy.toString());
    console.log("Solution:");
    console.log("0:", copy.toString());

    let steps = 1;
    while (copy.next().length !== 0) {
        console.log(`${steps}:`, copy.step());
        steps++;
    }

    return "Success";
}


KEYS = Array.from(document.getElementById("keyboard").children);

KEYBOARD = {
    "equation": [new Expression(), new Expression()],
    "cursor": [0, 0, 0],
    "encoding": "0123456789()*/+-=".split("").concat(["FRACTION", "SOLVE", "DELETE", "CLEAR"]),
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
            console.Error(`"${key}" is not a valid key.`);
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

        }

        else if (type <= 15) { //Operation
            
            if (cursor === undefined || cursor instanceof SimpleFraction) {
                expression.push(new Operation(key));
                KEYBOARD.cursor[KEYBOARD.cursor.length - 2] += 1;
                KEYBOARD.cursor[KEYBOARD.cursor.length - 1] = 1;
            }

            else {
                console.Error("Unknown element on cursor.");
            }
        }

        else {
            switch (type) {
                case 17: //ComplexFraction
    
                    break;
                
                case 18: //Solve
    
                    break;
                
                case 19: //Delete
    
                    break;
                
                case 20: //Clear
                    KEYBOARD.equation.forEach((e) => {e.value = []})
                    break;
            
                default:
                    console.Error("bruh")
                    break;
            }
        }

        output(KEYBOARD.equation[0].toString());
    }
}

KEYS.forEach(button => button.addEventListener("click", KEYBOARD.press));
