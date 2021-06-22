class Backend {

	static atlasRoot = "https://atlas.fm/api/v1";

	static saveCardToAtlas = async () => {
		console.log('[Backend.saveCardToAtlas]');
		console.log('Submitting Payload:');

		await this.atlasCardGenRequest('save');
		const success = true;
		console.log(`[[AtlasApp:CardGenStatus]]::${success ? 'Successful' : 'Failure'}`);
		console.log(sep)
	}

	static atlasCardGenRequest = async (mode) => {
		let requestPayload = {};
		if(mode === 'getcreate'){
			requestPayload = {
				'api_key': API_KEY,
				'url':recievedURL,
			};
		}else if(mode === 'save'){
			let pagePayload  = generatePayload();
			// console.log(pagePayload);
			requestPayload = {
				'api_key': API_KEY,
				'url':recievedURL,
				"title": pagePayload['title'],
				"topics": pagePayload['topics'],
				"people": pagePayload['people'],
				"read": pagePayload['read'] ? "on" : "off",
				"note": pagePayload['notes']
			};
		}else{
			console.error('Invalid AtlasCardGenRequestMode');
			return;
		}

		// Upload Request
		// console.log(requestPayload);
		let response = await fetch(
			'https://atlas.fm/api/v1/cards',
			{
				method: 'POST',
				body: JSON.stringify(requestPayload),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}
		);
		response = await response.json();

		let returnedData = {
			'title': response['title'] ?? '',
			'url': response['url'],
			'notes': response['comment'] ?? '',
			'topics': response['topics'].map((t) => t['name']),
			'people': response['people'].map((p) => p['name']),
			'read': ((response['read'] ?? 'off') === 'off') ? false : true,
		};
		// console.log(returnedData);
		return returnedData;
	}

	static autoSaveCardToAtlas = async () => {
		console.log('[Backend.autoSaveCardToAtlas]');
		let returnedData = await this.atlasCardGenRequest('save');
		// autoFillData(returnedData);
		console.log('AutoSaved to Atlas Servers!');
	}

	static upsertToAtlas = async () => {
		console.log('[Backend.upsertToAtlas]');
		console.log('Adding URL: (' + recievedURL + ') to Atlas (Upsert)');

		let returnedData = await this.atlasCardGenRequest('getcreate');
		autoFillData(returnedData);
		console.log(sep);
	}

}