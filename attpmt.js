const body = "# hello \n test \n www``` \n test \n in ``` \n something ** bald \n in**"
console.log(body)

const modifiers = [
	{
		"type": "bold",
		"regex": /\*\*\s?([^\n]+)\*\*/g,
		"template": "<b>$1</b>"
	},
	{
		"type": "italics",
		"regex": /\*\s?([^\n]+)\*/g,
		"template": "<i>$1</i>"
	}
]

const compounds = [
	{
		"type": "code",
		"rule": /```/g,
		"template": "<code>$1</code>"
	},
	{
		"type": "compoundbold",
		"rule": /\*\*/g,
		"template": "<b>$1</b>"
	}
]

let res = []

let selectedCompound = null
let splitBody = body.split("\n")
for (let i = 0; i < splitBody.length; i++) {
	let str = splitBody[i]
	let strType = "text"

	let laststr = splitBody[i - 1]

	let currentCompound = null
	for (let index = 0; index < compounds.length; index++) {
		const compound = compounds[index];
		if (compound.rule.test(str) == true) {
			currentCompound = compound
			break
		}
	}

	if (currentCompound != null) {

		if (selectedCompound != null) {
			console.log("howdy!!!!")
			res[res.length - 1].content.push(str.replace(currentCompound.rule, ""))

			if (currentCompound.rule.test(str) == true) selectedCompound = null
			continue
		}

		if (new RegExp("(.+)" + currentCompound.rule.source + "(.+)", "g").test(str)) {
			const ext = str.split(currentCompound.rule)

			if (ext[0].replace(/\s/g, "") != "") {
				str = str.replace(ext[0], "")
				if (res.length > 0) {
					res[res.length - 1].content.push(ext[0])
				} else {
					res.unshift({
						content: ext[0],
						type: "text"
					})
				}
			}
		}

		console.log("testing:",currentCompound.rule.test(str))
		if (currentCompound.rule.test(str) == true) {
			let isvalid = false
			for (let v = splitBody.length - 1; v > i; v--) {
				const found = currentCompound.rule.test(splitBody[v]);
				if (found == true) {
					console.log("something!!!")
					isvalid = true
					break
				}
			}
			console.log(str, "isvalid?", isvalid, currentCompound)
			if (isvalid) {
				selectedCompound = currentCompound
				str = str.replace(currentCompound.rule, "")
				strType = currentCompound.type
			}
		}
	}

	res.push({
		content: [str],
		type: strType
	})
}

console.log(res)
