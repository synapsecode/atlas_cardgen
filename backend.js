class Backend {

	static atlasRoot = "https://atlas.fm/api/v1";

	static addToAtlasQueue = async (url) => {
		console.log('[Backend.addToQueue]');
		console.log('Adding URL: (' + url + ') to the AtlasQueue');
		setTimeout(() => {
			console.log("Saved to Queue!");
			// Replace with Autofill if addToQueue returns with data;
			if(url === 'https://www.spacex.com/'){
				autoFillData({
					'title': 'Official SpaceX Website',
					'topics': ['Space', 'Physics', 'Falcon 9', 'Falcon Heavy', 'Starship Superheavy'],
					'people': ['Elon Musk', 'Gwynne Shotwell', 'John Insprucker'],
					'read': true,
					'notes': 'Take a look at the mesmerizing images on the SpaceX website!',
				});
			}
			console.log(sep)
		}, 1300);

	}


	static saveCardToAtlas = async () => {
		console.log('[Backend.saveCardToAtlas]');
		console.log('Submitting Payload:');
		let payload = generatePayload();
		console.log(payload);
		setTimeout(() => {
			const success = true;
			// --------------- DO NOT REMOVE ----------------
			// This console log, notifies the Atlas App that the Submission has been completed.
			console.log(`[[AtlasApp:CardGenStatus]]::${success ? 'Successful' : 'Failure'}`);
			// ----------------------------------------------
			console.log(sep)
		}, 1600);
	}

	static autoSaveCardToAtlas = async () => {
		console.log('[Backend.autoSaveCardToAtlas]');
		let payload = generatePayload();
		// console.log(payload);
		console.log('AutoSaved to Atlas Servers!');
	}


	static createNewPerson = async (person) => {
		console.log('[Backend.createNewPerson]');
		console.log(`Creating new Person (${person}) in AlgoliaSearch`);
		setTimeout(()=>{
				console.log(`Created New Person (${person})`);
				console.log(sep);
		}, 1000);
	}

	static createNewTopic = async (topic) => {
		console.log('[Backend.createNewTopic]');
		console.log(`Creating new Topic (${topic}) in AlgoliaSearch`);
		setTimeout(()=>{
				console.log(`Created New Topic (${topic})`);
				console.log(sep);
		}, 1000);
	}

}