import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

export default Route.extend(ConfirmationMixin, {
  model() {
    return EmberObject.create({
      id: 1,
      username: 'jasonmit',
      hasDirtyAttributes: false,
    });
  },
  confirmationMessage(model) {
    return `Unsaved changes for ${model.username}! Are you sure you want to continue?`;
  },
  onUnload() {
    const model = this.modelFor(this.routeName);
    model.set('hasDirtyAttributes', false);
  },
  actions: {
    markDirty() {
      const model = this.modelFor(this.routeName);
      model.set('hasDirtyAttributes', true);
    }
  }
});
