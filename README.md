# Ember Route Mixin for window.onbeforeunload

The default implementation is to check the model's `isDirty` property to
prevent transitioning away from the route or application unless the user
confirms this is the intended action.

Usage:
```js
import ConfirmationMixin from 'app/mixins/confirmation-mixin.js';

export default Ember.Route.extend(ConfirmationMixin, {
    abortMessage: 'You have unsaved changes, are you sure you want to leave?',
    
    onUnload: function() {
        /* do some clean up */
    }
});
```

And then on the controller for this route;

```js
export default Ember.ObjectController.extend({
    isDirty: function() {
        /* 
         * some custom logic here, or remove it and 
         * let it use the model's isDirty property 
         */
    }.property()
});
```
