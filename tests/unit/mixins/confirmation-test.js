import Ember from 'ember';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';
import { module, test } from 'qunit';

module('Unit | Mixin | confirmation');

test('allows mixing into a route', function(assert) {
  let ConfirmationRoute = Ember.Route.extend(ConfirmationMixin);
  let subject = ConfirmationRoute.create();
  assert.ok(subject);
});

test('throws an exception when mixing into a plain-ol\' ember object', function(assert) {
  let ConfirmationObject = Ember.Object.extend(ConfirmationMixin);
  assert.throws(function() {
    ConfirmationObject.create();
  });
});
