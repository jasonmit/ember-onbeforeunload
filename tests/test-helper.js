import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';
import {
  before,
  afterEach,
} from 'mocha';
import chai from 'chai';
import sinon from 'sinon';

setResolver(resolver);

before(function() {
  chai.config.truncateThreshold = 0;
  window.sandbox = sinon.createSandbox();
});

afterEach(function() {
  sandbox.restore();
});
