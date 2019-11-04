/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon'

describe('Acceptance: Smoke Test', function() {
  let windowConfirmStub, sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    windowConfirmStub = sandbox.stub(window, 'confirm');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('does not confirm with the user if the record is not dirtied', function() {
    visit('/');
    click('#foo-link');
    click('#index-link');
    andThen(function() {
      expect(windowConfirmStub.called).to.be.false;
    });
  });

  it('confirms with the user if the record is dirtied', function() {
    visit('/');
    click('#foo-link');
    click('#dirty-record-button');
    click('#index-link');
    andThen(function() {
      expect(windowConfirmStub.calledOnce).to.be.true;
    });
  });

  it('it allows navigation if the user confirms', function() {
    windowConfirmStub.returns(true);

    visit('/');
    click('#foo-link');
    click('#dirty-record-button');
    click('#index-link');
    andThen(function() {
      expect(currentRouteName()).to.equal('index');
    });
  });

  it('it aborts navigation if the user declines', function() {
    windowConfirmStub.returns(false);

    visit('/');
    click('#foo-link');
    click('#dirty-record-button');
    click('#index-link');
    andThen(function() {
      expect(currentRouteName()).to.equal('foo');
    });
  });

  it('passes the model to the custom message', function() {
    visit('/');
    click('#foo-link');
    click('#dirty-record-button');
    click('#index-link');
    andThen(function() {
      const msg = windowConfirmStub.getCall(0).args[0];
      expect(msg).to.contain('jasonmit');
    });
  });
});
