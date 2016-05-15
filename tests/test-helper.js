import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';
import {
  before,
  afterEach,
} from 'mocha';
import Ember from 'ember';
import chai from 'chai';
import sinon from 'sinon';

setResolver(resolver);

before(function() {
  chai.config.truncateThreshold = 0;
  Ember.lookup.sandbox = sinon.sandbox.create();
});

afterEach(function() {
  sandbox.restore();
});
