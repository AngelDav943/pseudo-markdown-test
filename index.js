const body = "# hello \n test \n www``` \n test \n ``` "
console.log(body)

let res = [] 

let iscode = false
let splitBody = body.split("\n")
for (let i=0; i < splitBody.length; i++) {
	let str = splitBody[i]
	let strType = "text"

	let laststr = splitBody[i-1]

	if (iscode == true) {
		res[res.length-1].content.push(str)

		if (/```/g.test(str) == true) iscode = false
		continue
	}
	
	if (/(.+)```(.+)/g.test(str)) {
		const ext = str.split("```")
		
		if (ext[0].replace(/\s/g, "") != "") {
			str = str.replace(ext[0], "")
			if (res.length > 0) {
				res[res.length-1].content.push(ext[0])
			} else {
				res.unshift({
					content: ext[0],
					type: "text"
				})
			}
		}
	}

	if (/```/g.test(str)) {
		let isvalid = false
		for (let v = splitBody.length-1; v > 0; v--) {
			let rstr = splitBody[v]
			if (v != i && /```/g.test(rstr)) {
				isvalid = true
				break
			}
		}
		if (isvalid) iscode = true
		strType = "code"
	}

	res.push({
		content: [str],
		type: strType
	})
}

console.log(res)
