# ember-onbeforeunload confirmation

[working jsbin demo](http://jsbin.com/cakejepeyu/1/edit)

The default implementation is to check the model's `isDirty` property to prevent transitioning away from the route or closing the window until the user confirms intent.  This pattern is typically used to prevent the user from mistakeningly closing to browser window without saving their data.

Usage:
```js
import ConfirmationMixin from 'app/mixins/confirmation-mixin.js';

export default Ember.Route.extend(ConfirmationMixin, {
    abortMessage: 'You have unsaved changes, are you sure you want to leave?',
    
    // A function that is invoked to determine whether to block the transition
    // or the user from closing the browser window.
    //
    // The default implementation if you do not override:
    preventUnload: function () {
        return !!get(this, 'controller.isDirty');
    },
    
    // Optional hook to execute some clean up on window unload
    onWindowUnload: function() {
        // Implement your own logic, if needed.
    }
});
```
