/* jshint expr:true */
import { expect } from 'chai';
import {
  context,
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

describe('ConfirmationMixin', function() {
  describe('init hook', function() {
    context('ensure mixed into Route', function() {
      it('allows mixing into a route', function() {
        let ConfirmationRoute = Ember.Route.extend(ConfirmationMixin);
        let subject = ConfirmationRoute.create();
        expect(subject).to.be.ok;
      });

      it('throws an exception when mixing into a plain-ol\' ember object', function() {
        let ConfirmationObject = Ember.Object.extend(ConfirmationMixin);
        expect(ConfirmationObject.create.bind()).to.throw;
      });
    });
  });
});
