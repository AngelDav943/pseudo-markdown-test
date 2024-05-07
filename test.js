const body = "# hello \n world \n www``` \n test \n in ``` \n something ** bolded text   **"

let objectBody = []

const modifiers = [
    {
        "type": "bold",
        "regex": /(\*\*)\s?([^\n]+)(\*\*)/g,
        "rule": /\*\*/g,
        "template": "<b>$1</b>"
    },
    {
        "type": "italics",
        "regex": /(\*)\s?([^\n]+)(\*)/g,
        "rule": /\*/g,
        "template": "<i>$1</i>"
    }
]


let iscode = false
const splittedBody = body.split("\n")
function isEmpty(str) {
    return str.replace(/\s/g, "") == ""
}

for (let bodyIndex = 0; bodyIndex < splittedBody.length; bodyIndex++) {
    let currentString = splittedBody[bodyIndex];
    let currentType = "text"

    if (iscode == true) {
        objectBody[objectBody.length - 1].content.push(currentString);
        if (/```(.+)/g.test(currentString)) {
            const ext = currentString.split("```")
            console.log("extt", ext)

            if (isEmpty(ext[1]) == false) {
                currentString = currentString.replace(ext[1], "")
                objectBody.push({
                    type: "text",
                    content: [ext[1]],
                })
            }
        }

        if (/```/g.test(currentString) == true) iscode = false
        if (iscode == true) continue
    }

    for (let modifierIndex = 0; modifierIndex < modifiers.length; modifierIndex++) {
        const modifier = modifiers[modifierIndex];
        if (modifier.regex.test(currentString) == true) {
            const testRegex = new RegExp("(.+)" + modifier.rule.source + "(.+)", "g")

            if (testRegex.test(currentString)) {
                const ext = currentString.split(modifier.regex)
                if (ext[0].replace(/\s/g, "") != "") {
                    currentString = currentString.replace(ext[0], "")
                    if (objectBody.length > 0) {
                        console.log(objectBody[objectBody.length - 1])
                        objectBody[objectBody.length - 1].content.push(ext[0])
                    } else {
                        objectBody.unshift({
                            type: "text",
                            content: [ext[0]],
                        })
                    }
                }
            }

            console.log("changing type...")
            currentString = currentString.replace(modifier.regex, "$2")
            currentType = modifier.type
        }
    }

    if (/(.+)```/g.test(currentString)) {
        const ext = currentString.split("```")
        console.log("hum?", ext, isEmpty(ext[0]))

        if (isEmpty(ext[0]) == false) {
            currentString = currentString.replace(ext[0], "")
            if (objectBody.length > 0) {
                objectBody[objectBody.length - 1].content.push(ext[0])
            } else {
                objectBody.unshift({
                    type: "text",
                    content: [ext[0]],
                })
            }
        }
    }

    if (/```/g.test(currentString)) {
        let isvalid = false
        for (let v = splittedBody.length - 1; v > bodyIndex; v--) {
            let rstr = splittedBody[v]
            if (/```/g.test(rstr)) {
                isvalid = true
                break
            }
        }
        if (isvalid) {
            currentString = currentString.replace(/```/g, "")
            iscode = true
            currentType = "code"
        }
    }

    let content = [currentString]
    if (isEmpty(currentString) == true) content = []

    objectBody.push({
        type: currentType,
        content: content,
    })
}

console.log(objectBody)