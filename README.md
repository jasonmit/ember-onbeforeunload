# Ember Route Mixin for window.onbeforeunload

The default implementation is to check the model's `isDirty` property to
prevent transitioning away from the route or application unless the user
confirms this is the intended action.

Usage:
```
import ConfirmationMixin from 'app/mixins/confirmation-mixin.js';

export default Ember.Route.extend(ConfirmationMixin, {
    abortMessage: 'You have unsaved changes, are you sure you want to leave?',
    
    onUnload: function() {
        /* do some clean up */
    }
});
```
