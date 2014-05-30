var get = Ember.get;

export default Ember.Mixin.create({
    abortMessage: 'There are unsaved changes.  Are you sure you would like to continue?',
    skipAbort: false,

    onUnload: Ember.K,

    preventUnload: function() {
        if(!this.skipAbort && get(this, 'currentModel') && get(this, 'currentModel.isDirty')) {
            return true;
        }
    },

    onBeforeUnload: function() {
        if(this.preventUnload()) {
            return this.get('abortMessage');
        }
    },

    activate: function() {
        window.onbeforeunload = function() {
            return this.onBeforeUnload();
        }.bind(this);

        window.onunload = function() {
            return this.onUnload();
        }.bind(this);
    },

    deactivate: function() {
        window.onbeforeunload = null;
        window.onunload = null;
    },

    actions: {
        willTransition: function(transition) {
            var allow = transition.targetName.indexOf(this.routeName + '.') === 0;

            if(!allow && this.preventUnload()) {
                if(!window.confirm(this.get('abortMessage'))) {
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
