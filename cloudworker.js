let sourceRootURL = "https://raw.githubusercontent.com/synapsecode/atlas_cardgen/master/";
const useGeneratedHTML = false;

const replaceHTML = (html, url, apikey, cid) => {
	return html.replace(
		// Replacing the ExampleURl with the URLRecieved from the Request to the Cloudflare worker
		'<RECIEVED_URL>',
		url,
	).replaceAll(
		// Replacing the Placeholder with the users API Key
		'<API_KEY_PLACEHOLDER>',
		apikey,
	).replaceAll(
		//Replacing the Placeholder with the User Creator ID
		'<USER_CREATOR_ID>',
		cid
	);
}

async function generateHTMLFromGithubCode ({api_key, recievedURL, cid}) {

	// Using a pre-generated HTML Code for Fast Access
	if(useGeneratedHTML){
		let htmlGeneratedCode = await (await fetch(sourceRootURL + 'generated.html')).text()
		htmlGeneratedCode = replaceHTML(htmlGeneratedCode, recievedURL, api_key, cid);
		return htmlGeneratedCode;
	}
	
	// Get all the Required Source Code from Github
	let htmlBaseCode = await (await fetch(sourceRootURL + 'cardgen.html')).text()
	let backendJSCode = await (await fetch(sourceRootURL + 'backend.html')).text()
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
		// Embedding the DropDownJSCode
		'<script src="./backend.js"></script>',
		`<!--DropDownJS Code-->\n<script>\n${backendJSCode}\n</script>\n`
	);

	// Replacing the Constants in the HTML
	htmlTransformedCode = replaceHTML(htmlTransformedCode, recievedURL, api_key, cid);

	// console.log(htmlTransformedCode);
	return htmlTransformedCode;
}


// This function performs certain operations in order to prevent errors
// As urls that are added as a part of the original url can sometimes be difficult to parse
const getRequiredURLParams = (url) => {
    // Regex Matcher Code
    let urlMatch = (/url=\((http[s]?:\/\/[^ ]*)\)/g).exec(url);
    let apiKeyMatch = (/api_key=\w+/g).exec(url);
    let cidURLMatch = (/cid=\d+/g).exec(url);

    if(urlMatch !== null && apiKeyMatch !== null && cidURLMatch != null){
        let inner_url = urlMatch[0].substring(5,urlMatch[0].length -1);
        let api_key = apiKeyMatch[0].split('=')[1];
        let cid = cidURLMatch[0].split('=')[1];
        return [{ 'api_key': api_key, 'url': inner_url, 'cid': cid }, 'success'];
    }else{
        let nulls = [
            (urlMatch === null) ? 'url' : '',
            (apiKeyMatch === null) ? 'api_key' : '',
            (cidURLMatch === null) ? 'cid' : '',
        ].filter((e) => e!=='' );
        return [null, `Please provide the following query parameters: ${nulls.join(', ')}`];
    }
}


async function handleRequest(request) {
    const sent_url = request.url;
    let [params, msg] = getRequiredURLParams(sent_url);
    if(params !== null){
        let apiKey = params['api_key'];
        let URL = params['url'];
        let creator_id = params['cid'];
        return new Response(
            await generateHTMLFromGithubCode({
                recievedURL: URL,
                api_key: apiKey,
                cid: creator_id,
            }), {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }else{
        return new Response("Invalid URL Formatting: " + msg);
    }
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})


// Usage
// https://atlasfm-cardgen.synapsecode.workers.dev/?url=(<YOUR_URL>)&api_key=<YOUR_API_KEY>&cid=<YOUR_CID>