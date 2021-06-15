const Search = (token = {}) => {
	return {
		client: algoliasearch(token.appId, token.key),

		find: async function (indexName, keyword, filters = "", serializer = null) {
			const index = this.client.initIndex(indexName)
			const request = index.search(keyword, {
				filters: filters,
				hitsPerPage: 6,
				page: 0,
			})

			return await request.then(function searchDone(content) {
				if (serializer) {
					// console.log(content.hits)
					return serializer(content.hits)
				} else {
					return content.hits
				}
			})
		}
	}
};
const SearchItemSerializer = {
	topicSelect: function (data) {
		return data.map(topic => {
			return {
				name: topic.name,
				value: topic.name,
				badges: [`${topic.block_count} Cards`]
			}
		})
	},

	personSelect: function (data) {
		return data.map(person => {
			return {
				name: person.name,
				value: person.identifier,
				avatar: person.avatar,
			}
		})
	}
};