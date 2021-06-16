let sourceRootURL = "https://raw.githubusercontent.com/synapsecode/atlas_cardgen/master/";
let recievedURL = "https://www.codegrepper.com/code-examples/javascript/javascript+call+to+read+text+file+from+url";
let api_key = '';

const sanitizeURL = (raw) => {
	return raw;
}

async function generateHTMLFromGithubCode (url) {
	// Get all the Required Source Code from Github
	let htmlBaseCode = await (await fetch(sourceRootURL + 'cardgen.html')).text()
	let searchJSCode = await (await fetch(sourceRootURL + 'search.js')).text()
	let autosaveJSCode = await (await fetch(sourceRootURL + 'autosave.js')).text()
	let dropdownJSCode = await (await fetch(sourceRootURL + 'dropdown.js')).text()

	// Transformation of the Recieved HTMLCode
	htmlTransformedCode = htmlBaseCode.replace(
		// Embedding the SearchJSCode
		'<script src="./search.js"></script>',
		`<!--SearchJS Code-->\n<script>\n${searchJSCode}\n</script>\n`
	).replace(
		// Embedding the AutoSaveJSCode
		'<script src="./autosave.js"></script>',
		`<!--AutoSaveJS Code-->\n<script>\n${autosaveJSCode}\n</script>\n`
	).replace(
		// Embedding the DropDownJSCode
		'<script src="./dropdown.js"></script>',
		`<!--DropDownJS Code-->\n<script>\n${dropdownJSCode}\n</script>\n`
	).replace(
		// Replacing the ExampleURl with the URLRecieved from the Request to the Cloudflare worker
		'http://example.com/',
		recievedURL
	).replace(
		// Replacing the Placeholder with the users API Key
		'<API_KEY_PLACEHOLDER>',
		api_key,
	);
	
	return htmlTransformedCode;
}
