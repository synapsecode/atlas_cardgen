let sourceRootURL = "https://raw.githubusercontent.com/synapsecode/atlas_cardgen/master/";

async function generateHTMLFromGithubCode ({api_key, recievedURL,}) {
	// Cleans up the URL
	const sanitizeURL = (raw) => {
		return raw;
	}
	
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
		sanitizeURL(recievedURL),
	).replaceAll(
		// Replacing the Placeholder with the users API Key
		'<API_KEY_PLACEHOLDER>',
		api_key,
	);

	// console.log(htmlTransformedCode);
	return htmlTransformedCode;
}


async function handleRequest(request) {
	let requrl = request.url.split('?');
	if(requrl.length < 2){
		return new Response("Invalid URL Format. Please include the 'api_key' & the 'url' query parameters");
	}
	// Parse the RequestURL to get APIKey & URL
	let params = (function(a) {
		if (a == "") return {};
		var b = {};
		for (var i = 0; i < a.length; ++i)
		{
			var p=a[i].split('=', 2);
			if (p.length == 1)
				b[p[0]] = "";
			else
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return b;
	})(requrl[1].split('&'));

	let apiKey = params['api_key'];
	let URL = params['url'];

	if(apiKey === undefined || URL === undefined){
		return new Response("Invalid URL Format. Please include the 'api_key' & the 'url' query parameters");
	}
	
	return new Response(
		await generateHTMLFromGithubCode({
			recievedURL: URL,
			api_key: apiKey,
		}), {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	});
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})