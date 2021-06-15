// Alpine Dropdown Search - with algoliasearch
window.Dropdown = (configs = { selected: [], autoSave: false, parentComponent: null, filters: "", name:''}) => {
	const selected = configs.selected.map(d => tryParse(d))

	function tryParse(data) {
		try {
			return JSON.parse(data)
		} catch (err) {
			if (typeof data == 'string') {
				return { name: data, value: data }
			} else if (Array.isArray(data)) {
				return { name: data[1], value: data[0] }
			}
		}
	}

	return {
		open: false,
		search: "",
		badges: selected,
		searchOptions: [],
		highlighted: null,
		auto_save: configs.autoSave,
		parentComponent: eval(configs.parentComponent),
		filters: configs.filters,
		createHighlighted: false,

		assignSelected: function (val) {
			this.search = val
			this.submitInput()
		},

		changeInputValue: function (stopAutoSave = false) {
			this.$refs.originalInput.innerHTML = ""
			this.badges.forEach(badge => {
				const option = document.createElement('option')
				option.innerHTML = badge.name
				option.value = badge.name
				option.setAttribute('selected', true)

				this.$refs.originalInput.appendChild(option)
			})

			if (this.auto_save && this.parentComponent && !stopAutoSave) this.parentComponent.autoSave(this.parentComponent.$el)
		},

		toggleBadge: function (badge) {
			const index = this.badges.findIndex(b => b.name == badge.name)
			if (index > -1) {
				this.badges.splice(index, 1);
			} else {
				this.pushBadge(badge)
			}

			this.changeInputValue()
			this.$refs.searchInput.focus()
		},

		submitInput: function (event = null) {
			if (this.highlighted) {
				if (event) event.preventDefault()
				// console.log(configs.name + " :: PreviouslyExistingValue Added  -> ");
;				this.toggleBadge(this.highlighted)
			} else if (this.search && !this.badges.find(badge => badge.name == this.search)) {
				if (event) event.preventDefault()
				const newBadge = this.searchOptions.find(b => b.name == this.search) || { name: this.search, value: this.search }
				// console.log("Creating NewEntry(" + configs.name + ") : " + this.search)
				this.pushBadge(newBadge)
			}

			this.changeInputValue()
			this.search = ""
			this.filter()
			this.open = false
			this.highlighted = null
		},

		pushBadge: function (badge) {
			this.badges.push(badge);
		},

		removeBadge: function (event) {
			this.badges.pop()
			this.changeInputValue()
		},

		filter: function (keyword = this.search) {
			this.open = true
			this.createHighlighted = false
			console.log(keyword);
			this.asyncSearch(keyword)
		},

		searchOnChange: function (event) {
			if (event.key == "Backspace" && !this.search) {
				this.removeBadge(event)
			} else if (!this.search && event.key == "Tab") {
				this.changeInputValue()
				this.search = ""
				this.filter()
				this.open = false
				this.highlighted = null
			} else if (event.key == "Enter" || event.key == "Tab") {
				if (!this.search && !this.open) return false
				this.submitInput(event)
			} else if (event.key == "ArrowDown") {
				this.createHighlighted = false
				if (this.highlighted) {
					const index = this.searchOptions.indexOf(this.highlighted)
					if ((index + 1) >= this.searchOptions.length) {
						this.createHighlighted = true
						this.highlighted = null
					} else {
						this.highlighted = this.searchOptions[index + 1]
					}
				} else {
					this.highlighted = this.searchOptions[0]
				}

			} else if (event.key == "ArrowUp") {
				this.createHighlighted = false
				if (this.highlighted) {
					const index = this.searchOptions.indexOf(this.highlighted)
					if (index == 0) {
						this.createHighlighted = true
						this.highlighted = null
					} else {
						this.highlighted = this.searchOptions[index - 1]
					}
				} else {
					this.highlighted = this.searchOptions[this.searchOptions.length - 1]
				}
			} else {

			}

			this.$refs.searchInput.focus()
		},

		asyncSearch: async function (keyword = "") {		
			const search = Search({ appId: "AIGQMOA8F8", key: "44fa814eb0128fb014b901314d6683f6" })
			const result = await search.find(configs.search.index, keyword, this.filters, SearchItemSerializer[configs.search.serializer])
			this.searchOptions = result
			if (result.length) {
				this.highlighted = result[0]
			} else {
				this.createHighlighted = true
				this.highlighted = null
			}
		}
	}
};