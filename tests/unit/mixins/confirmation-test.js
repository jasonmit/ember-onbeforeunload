/* jshint expr:true */
import { expect } from 'chai';
import {
  context,
  describe,
  it,
  beforeEach
} from 'mocha';
import Ember from 'ember';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

describe('ConfirmationMixin', function() {
  let defaultSubject;
  beforeEach(function() {
    let ConfirmationRoute = Ember.Route.extend(ConfirmationMixin);
    defaultSubject = ConfirmationRoute.create();
  });

  describe('init hook', function() {
    context('ensure mixed into Route', function() {
      it('allows mixing into a route', function() {
        expect(defaultSubject).to.be.ok;
      });

      it('throws an exception when mixing into a plain-ol\' ember object', function() {
        let ConfirmationObject = Ember.Object.extend(ConfirmationMixin);
        expect(ConfirmationObject.create.bind()).to.throw;
      });
    });
  });

  describe('isPageDirty', function() {
    context('has model', function() {
      let subject, modelObj;
      beforeEach(function() {
        subject = defaultSubject;
        modelObj = Ember.Object.create({
          hasDirtyAttributes: undefined,
        });
      });

      it('returns hasDirtyAttributes from model', function() {
        modelObj.set('hasDirtyAttributes', true);
        expect(subject.isPageDirty(modelObj)).to.be.true;

        modelObj.set('hasDirtyAttributes', false);
        expect(subject.isPageDirty(modelObj)).to.be.false;
      });
    });

    context('no modelFor route', function() {
      let subject;
      beforeEach(function() {
        subject = defaultSubject;
      });

      it('returns false', function() {
        expect(subject.isPageDirty()).to.be.false;
      });
    });
  });

  describe('confirmationMessage', function() {
    it('defaults to a sane message', function() {
      const subject = defaultSubject;
      expect(subject.confirmationMessage()).to.include('Unsaved changes');
    });
  });

  describe('readConfirmation', function() {
    it('handles overridden string confirmations', function() {
      const subject = Ember.Route.extend(ConfirmationMixin, {
        confirmationMessage() {
          return 'custom warning';
        },
        modelFor() {
          return null;
        },
      }).create();

      expect(subject.readConfirmation()).to.equal('custom warning');
    });

    it('calls overridden confirmation functions with the current route model', function() {
      const subject = Ember.Route.extend(ConfirmationMixin, {
        confirmationMessage(model) {
          return `custom warning with name: ${model.get('name')}`;
        },
        routeName: 'test-route',
      }).create();
      const modelForStub = sandbox.stub(subject, 'modelFor')
                                  .returns(Ember.Object.create({ name: 'foo'}));

      expect(subject.readConfirmation()).to.equal('custom warning with name: foo');
      expect(modelForStub.getCall(0).args).to.deep.equal([subject.routeName]);
    });
  });

  describe('shouldCheckIsPageDirty', function() {
    it('allows when navigating to child routes', function() {
      const parentRoute = 'parent.index';
      const childRoute = `${parentRoute}.sub`;

      const subject = Ember.Route.extend(ConfirmationMixin, {
        routeName: parentRoute,
      }).create();

      const transitionMock = {
        targetName: childRoute
      };

      expect(subject.shouldCheckIsPageDirty(transitionMock)).to.be.true;
    });

    it('does not allow when navigating to an unrelated route', function() {
      const parentRoute = 'parent.index';
      const unrelatedRoute = `unrelated.index`;

      const subject = Ember.Route.extend(ConfirmationMixin, {
        routeName: parentRoute,
      }).create();

      const transitionMock = {
        targetName: unrelatedRoute
      };

      expect(subject.shouldCheckIsPageDirty(transitionMock)).to.be.false;
    });
  });

  describe('handleEvent', function() {
    context('beforeunload', function() {
      it('calls the onBeforeunload method with the event', function() {
        const subject = defaultSubject;
        const eventMock = {
          type: 'beforeunload',
        };
        const onBeforeunloadStub = sandbox.stub(subject, 'onBeforeunload');

        subject.handleEvent(eventMock);
        expect(onBeforeunloadStub.calledOnce).to.be.true;
        expect(onBeforeunloadStub.getCall(0).args).to.deep.equal([eventMock]);
      });
    });

    context('unload', function() {
      it('calls the onUnload method with the event', function() {
        const subject = defaultSubject;
        const eventMock = {
          type: 'unload',
        };
        const onUnloadStub = sandbox.stub(subject, 'onUnload');

        subject.handleEvent(eventMock);
        expect(onUnloadStub.calledOnce).to.be.true;
        expect(onUnloadStub.getCall(0).args).to.deep.equal([eventMock]);
      });
    });
  });

  describe('onBeforeunload handler', function() {
    context('page is dirty', function() {
      let subject, eventMock;
      beforeEach(function() {
        subject = defaultSubject;
        sandbox.stub(subject, 'isPageDirty').returns(true);
        sandbox.stub(subject, 'readConfirmation').returns('Unsaved changes');
        sandbox.stub(subject, 'modelFor').returns(undefined);

        eventMock = {
          type: 'beforeunload'
        };
      });

      it('sets the event returnValue to the confirmation message', function() {
        subject.onBeforeunload(eventMock);

        expect(eventMock.returnValue).to.equal('Unsaved changes');
      });

      it('returns the confirmation message from the handler', function() {
        const retVal = subject.onBeforeunload(eventMock);

        expect(retVal).to.equal('Unsaved changes');
      });
    });

    context('page is not dirty', function() {
      let subject;
      beforeEach(function() {
        subject = defaultSubject;
        sandbox.stub(subject, 'isPageDirty').returns(false);
        sandbox.stub(subject, 'modelFor').returns(undefined);
      });

      it('does not modify the event in any way', function() {
        const eventStub = sandbox.stub();
        subject.onBeforeunload(eventStub);

        expect(eventStub.called).to.be.false;
      });
    });
  });

  context('route lifecycle', function() {
    let addEventListenerStub, removeEventListenerStub;
    beforeEach(function() {
      addEventListenerStub = sandbox.stub(window, 'addEventListener');
      removeEventListenerStub = sandbox.stub(window, 'removeEventListener');
    });

    describe('activate', function() {
      it('adds a listener for beforeunload event', function() {
        const subject = defaultSubject;
        subject.activate();
        expect(addEventListenerStub.getCall(0).args).to.deep.equal(['beforeunload', subject, false]);
      });

      it('adds a listener for unload event', function() {
        const subject = defaultSubject;
        subject.activate();
        expect(addEventListenerStub.getCall(1).args).to.deep.equal(['unload', subject, false]);
      });
    });

    describe('deactivate', function() {
      it('removes the beforeunload listener', function() {
        const subject = defaultSubject;
        subject.deactivate();
        expect(removeEventListenerStub.getCall(0).args).to.deep.equal(['beforeunload', subject, false]);
      });

      it('removes the unload listener', function() {
        const subject = defaultSubject;
        subject.deactivate();
        expect(removeEventListenerStub.getCall(1).args).to.deep.equal(['unload', subject, false]);
      });
    });

    describe('willTransition', function() {
      let windowConfirmStub;
      beforeEach(function() {
        windowConfirmStub = sandbox.stub(window, 'confirm');
      });

      context('dirty transition allowed', function() {
        let subject;
        beforeEach(function() {
          subject = defaultSubject;
          sandbox.stub(subject, 'shouldCheckIsPageDirty').returns(true);
        });

        it('does not check isPageDirty', function() {
          const isPageDirtyStub = sandbox.stub(subject, 'isPageDirty');

          subject.send('willTransition');

          expect(isPageDirtyStub.called).to.be.false;
        });

        it('does not confirm with the user even if page is dirty', function() {
          subject.send('willTransition');

          expect(windowConfirmStub.called).to.be.false;
        });
      });

      context('dirty transition not allowed', function() {
        let subject;
        beforeEach(function() {
          subject = defaultSubject;
          sandbox.stub(subject, 'shouldCheckIsPageDirty').returns(false);
          sandbox.stub(subject, 'modelFor').returns(null);
        });

        context('page is not dirty', function() {
          beforeEach(function() {
            sandbox.stub(subject, 'isPageDirty').returns(false);
          });

          it('does not confirm with the user', function() {
            subject.send('willTransition');

            expect(windowConfirmStub.called).to.be.false;
          });

          it('bubbles the willTransition event', function() {
            const retVal = subject.send('willTransition');
            expect(retVal).to.equal(true);
          });
        });

        context('page is dirty', function() {
          let transition, abortTransitionStub;
          beforeEach(function() {
            sandbox.stub(subject, 'isPageDirty').returns(true);

            abortTransitionStub = sandbox.stub();
            transition = {
              abort: abortTransitionStub
            };
          });

          it('confirms the transition with the user', function() {
            subject.send('willTransition', transition);

            expect(windowConfirmStub.calledOnce).to.be.true;
          });

          it('uses the result of readConfirmation for the message', function() {
            sandbox.stub(subject, 'readConfirmation').returns('my message');
            subject.send('willTransition', transition);

            expect(windowConfirmStub.getCall(0).args).to.deep.equal(['my message']);
          });

          it('bubbles the event if the user confirms with the confirm dialog', function() {
            windowConfirmStub.returns(true);
            const retVal = subject.send('willTransition', transition);

            expect(retVal).to.be.true;
          });

          it('aborts the transition if the user rejects the confirm dialog', function() {
            windowConfirmStub.returns(false);
            subject.send('willTransition', transition);

            expect(abortTransitionStub.calledOnce).to.be.true;
          });
        });
      });
    });
  });
});
