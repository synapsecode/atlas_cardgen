window.AutoSave = () => {
	return {
		timer: null,
		saving: false,

		autoSave: function (el = null) {
			if (this.timer) {
				clearTimeout(this.timer)
			}

			this.timer = setTimeout(this.save.bind(null, el || this.$el), 3000);
		},

		save: function (form) {
			const autoSaveLabel = form.querySelector('#autoSaveLabel')
			const autoSaveParam = document.createElement('input')
			autoSaveParam.classList.add('hidden')
			autoSaveParam.name = 'auto_save'
			autoSaveParam.type = "text"
			autoSaveParam.value = true
			form.prepend(autoSaveParam)
			autoSaveLabel.classList.remove('opacity-0')
			//Rails.fire(form.closest('form'), 'submit')
			//-----------------------------TODO: HANDLE RAILSFIRE @ASK-TONY-----------------------------------
			console.log('Creating Object in Algolia');
			//Fixed Permanant AutoSaveLoading
			setTimeout(()=>autoSaveLabel.classList.add('opacity-0'), 3000);
			//-----------------------------------------------------------------------------------------------
			autoSaveParam.remove()
		}
	}
}