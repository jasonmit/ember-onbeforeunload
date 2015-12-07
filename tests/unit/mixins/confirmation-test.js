import Ember from 'ember';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';
import { module, test } from 'qunit';

module('Unit | Mixin | confirmation');

// Replace this with your real tests.
test('it works', function(assert) {
  let ConfirmationObject = Ember.Object.extend(ConfirmationMixin);
  let subject = ConfirmationObject.create();
  assert.ok(subject);
});
