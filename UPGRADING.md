# Upgrading
This guide will help you navigate any breaking changes in the API.

## 1.0.x and higher
With version 1.0.0, breaking changes were introduced to the API. These
changes were made to make the API methods more understandable.

### `canUnload`
* `canUnload` was renamed to `isPageDirty`. Please rename any uses of `canUnload` to `isPageDirty`.
* The default behavior of `canUnload` has changed. Previously, it looked for `controller.isDirty` by default.
Because controllers will be removed in a future version of Ember, this is no longer
the behavior. By default, we will get the current model for the Route and check
if that model `hasDirtyAttributes`. You can maintain the existing default behavior
like this:
```javascript
export default Ember.Route.extend({
    isPageDirty() {
      return !!get(this, 'controller.isDirty');
    }
});
```

### `allowUnload`
* `allowUnload` was rename to `shouldCheckIsPageDirty`. Please rename any uses of
`allowUnload` to `shouldCheckIsPageDirty`.
* The default behavior remains the same.
