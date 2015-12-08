import Ember from 'ember';

const { get, Mixin } = Ember;

export default Mixin.create({
  confirmationMessage(/* model */) {
    return 'Unsaved changed! Are you sure you would like to continue?';
  },

  onUnload() {
    /* intentionally left blank to implement own custom teardown logic */
  },

  onBeforeunload(e) {
    if (this.canUnload()) {
      const confirmationMessage = this.readConfirmation();
      e.returnValue = confirmationMessage;     // Gecko and Trident
      return confirmationMessage;              // Gecko and WebKit
    }
  },

  canUnload() {
    return !!get(this, 'controller.isDirty');
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
    window.addEventListener('beforeunload', this, false);
    window.addEventListener('unload', this, false);
    return _super;
  },

  deactivate() {
    const _super = this._super(...arguments);
    window.removeEventListener('beforeunload', this, false);
    window.removeEventListener('unload', this, false);
    return _super;
  },

  readConfirmation() {
    let msg = get(this, 'confirmationMessage');

    if (typeof msg === 'function') {
      msg = msg.call(this, get(this, 'currentModel'));
    }

    return msg;
  },

  allowUnload(transition) {
    return transition.targetName.indexOf(this.routeName + '.') === 0;
  },

  actions: {
    willTransition(transition) {
			this._super(...arguments);

      const allow = this.allowUnload(transition);

      if (!allow && this.canUnload()) {
        const msg = this.readConfirmation();

        if (!window.confirm(msg)) {
          transition.abort();
        }
        else {
          return true;
        }
      }

      return allow;
    }
  }
});
