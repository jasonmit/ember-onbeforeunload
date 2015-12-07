import Ember from 'ember';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

export default Ember.Route.extend(ConfirmationMixin, {
	model() {
		return {
			id: 1,
			username: 'jasonmit'
		};
	},
	confirmationMessage(model) {
		return `Unsaved changes for ${model.username}! Are you sure you want to continue?`;
	},
	onUnload() {
		this.set('controller.isDirty', false);
	}
});
