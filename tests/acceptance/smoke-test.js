import { click, currentRouteName, visit } from '@ember/test-helpers';
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon'
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { setupApplicationTest } from 'ember-mocha';

describe('Acceptance: Smoke Test', function() {
  setupApplicationTest();
  let application, windowConfirmStub, sandbox;

  beforeEach(function() {
    application = startApp();
    sandbox = sinon.createSandbox();
    windowConfirmStub = sandbox.stub(window, 'confirm');
  });

  afterEach(function() {
    destroyApp(application);
    sandbox.restore();
  });

  it('does not confirm with the user if the record is not dirtied', async function() {
    await visit('/');
    await click('#foo-link');
    await click('#index-link');
    expect(windowConfirmStub.called).to.be.false;
  });

  it('confirms with the user if the record is dirtied', async function() {
    await visit('/');
    await click('#foo-link');
    await click('#dirty-record-button');
    await click('#index-link');
    expect(windowConfirmStub.calledOnce).to.be.true;
  });

  it('it allows navigation if the user confirms', async function() {
    windowConfirmStub.returns(true);

    await visit('/');
    await click('#foo-link');
    await click('#dirty-record-button');
    await click('#index-link');
    expect(currentRouteName()).to.equal('index');
  });

  it('it aborts navigation if the user declines', async function() {
    windowConfirmStub.returns(false);

    await visit('/');
    await click('#foo-link');
    await click('#dirty-record-button');
    await click('#index-link');
    expect(currentRouteName()).to.equal('foo');
  });

  it('passes the model to the custom message', async function() {
    await visit('/');
    await click('#foo-link');
    await click('#dirty-record-button');
    await click('#index-link');
    const msg = windowConfirmStub.getCall(0).args[0];
    expect(msg).to.contain('jasonmit');
  });
});
