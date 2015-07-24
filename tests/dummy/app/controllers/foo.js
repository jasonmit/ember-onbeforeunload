import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    markDirty() {
      this.set('isDirty', true);
    }
  },
  isDirty: false
});
