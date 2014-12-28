var get = Ember.get;

export default Ember.Mixin.create({
    abortMessage: 'There are unsaved changes.  Are you sure you would like to continue?',

    // you can implement some custom clean up logic here
    onWindowUnload: Ember.K,

    // you can implement your own condition to show the condition
    preventUnload: function () {
        return !!get(this, 'controller.isDirty');
    },

    onBeforeWindowUnload: function () {
        if (this.preventUnload()) {
            return get(this, 'abortMessage');
        }
    },

    'on-activate': Ember.on('activate', function () {
        window.onbeforeunload = this.onBeforeWindowUnload.bind(this);
        window.onunload = this.onWindowUnload.bind(this);
    }),

    'on-deactivate': Ember.on('deactivate', function () {
        window.onbeforeunload = null;
        window.onunload = null;
    }),

    actions: {
        willTransition: function (transition) {
            var allow = transition.targetName.indexOf(this.routeName + '.') === 0;

            if (!allow && this.preventUnload()) {
                if (!window.confirm(get(this, 'abortMessage'))) {
                    transition.abort();
                }
                else {
                    allow = true;
                }
            }

            return allow;
        }
    }
});
