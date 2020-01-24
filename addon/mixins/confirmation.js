/* eslint-disable ember/no-new-mixins */

import { get } from '@ember/object';
import { on } from '@ember/object/evented';
import Mixin from '@ember/object/mixin';
import Route from '@ember/routing/route';

export default Mixin.create({
  _ensureConfirmationMixinOnRoute: on('init', function() {
    if (!(this instanceof Route)) {
      throw Error('ember-onbeforeunload ConfirmationMixin must be mixed into a Route.');
    }
  }),

  confirmationMessage(/* model */) {
    return 'Unsaved changes! Are you sure you would like to continue?';
  },

  onUnload() {
    /* intentionally left blank to implement own custom teardown logic */
  },

  onRouteUnload() {
    /* intentionally left blank to implement own custom teardown logic */
  },

  onBeforeunload(e) {
    if (this.isPageDirty(this.modelFor(this.routeName))) {
      const confirmationMessage = this.readConfirmation();
      e.returnValue = confirmationMessage;     // Gecko and Trident
      return confirmationMessage;              // Gecko and WebKit
    }
  },

  isPageDirty(model) {
    if (model) {
      return !!get(model, 'hasDirtyAttributes');
    } else {
      return false;
    }
  },

  handleEvent(event) {
    let fnName = event.type.split('');

    if (fnName.length) {
      fnName[0] = fnName[0].toUpperCase();
      const fn = this['on' + fnName.join('')];

      if (typeof fn === 'function') {
        fn.apply(this, arguments);
      }
    }
  },

  activate() {
    const _super = this._super(...arguments);

    if (window && window.addEventListener) {
      window.addEventListener('beforeunload', this, false);
      window.addEventListener('unload', this, false);
    }

    return _super;
  },

  deactivate() {
    const _super = this._super(...arguments);

    if (window && window.removeEventListener) {
      window.removeEventListener('beforeunload', this, false);
      window.removeEventListener('unload', this, false);
    }

    return _super;
  },

  readConfirmation() {
    let msg = get(this, 'confirmationMessage');

    if (typeof msg === 'function') {
      const currentModel = this.modelFor(this.routeName);
      msg = msg.call(this, currentModel);
    }

    return msg;
  },

  shouldCheckIsPageDirty(transition) {
    return transition.targetName.indexOf(this.routeName + '.') === 0;
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const allow = this.shouldCheckIsPageDirty(transition);

      if (!allow && this.isPageDirty(this.modelFor(this.routeName))) {
        const msg = this.readConfirmation();

        if (this.customConfirm) {
          if (this._transitionConfirmed) {
            this._transitionConfirmed = undefined;
            return true;
          }

          transition.abort();
          this.customConfirm(transition).then(() => {
            this._transitionConfirmed = true;
            transition.retry();
          });
        } else if (window && window.confirm && !window.confirm(msg)) {
          transition.abort();
          return false;
        } else {
          this.onRouteUnload();
        }
      }

      return true;
    }
  }
});
