# ember-onbeforeunload
[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Ember Observer Score](https://emberobserver.com/badges/ember-onbeforeunload.svg)](https://emberobserver.com/addons/ember-onbeforeunload)

An add-on to conditionally prompt the user when transitioning between routes or closing the browser.

## Installation
This library is tested against Ember 1.13.x and Ember 2.x.

```
ember install ember-onbeforeunload
```

## Usage
To get started, mix the `ConfirmationMixin` into your `Ember.Route`. By default,
the user will be prompted beforeunload any time the `model` for the route
`hasDirtyAttributes` ([docs](http://emberjs.com/api/data/classes/DS.Model.html#property_hasDirtyAttributes)).

```js
// app/routes/foo.js
import Ember from 'ember';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

export default Ember.Route.extend(ConfirmationMixin, { });
```

## Customization
This addon tries to provide sane defaults, but it also exposes all of the internals
for customization.

### Confirmation Message
You can customize the message displayed in the confirmation dialog by overriding
the `confirmationMessage` property. You can either pass a hard-coded string,
or use a function.

```javascript
export default Ember.Route.extend(ConfirmationMixin, {
  confirmationMessage: 'Are you sure?',
});
```

```javascript
export default Ember.Route.extend(ConfirmationMixin, {
  confirmationMessage(model) {
    return `Are you sure you want to unload ${model.name}?`;
  }
});
```

```javascript
export default Ember.Route.extend(ConfirmationMixin, {
  i18n: service(), // see ember-i18n
  confirmationMessage() {
    return this.get('i18n').t('myTranslation');
  }
});
```

### isPageDirty logic
If you do not sure Ember Data, or you have other logic to determine whether or
not the page is dirty, you can override the `isPageDirty` method.

```javascript
export default Ember.Route.extend(ConfirmationMixin, {
  isPageDirty(/* model */) {
    const isDirty = true; // your logic here
    return isDirty;
  }
});
```

### Allow Dirty Transitions
By default, we allow navigating within the hierarchy of route you mix the
`ConfirmationMixin` into. For example, navigating from `myroute.index` to
`myroute.index.subroute` would not check `isPageDirty`. If you have other logic
that determines when a dirty transition should be allowed, you can override
`shouldCheckIsPageDirty`.

```javascript
export default Ember.Route.extend(ConfirmationMixin, {
  shouldCheckIsPageDirty(transition) {
    const isChildRouteTransition = this._super(...arguments);

    if (transition.targetName === 'some-exempt-route') {
      return true;
    } else {
      return isChildRouteTransition;
    }
  }
});
```

### onUnload logic
If you have some custom logic you'd like to execute when your route is unloaded,
you can tie into the `onUnload` function. By default, this function is a no-op.

```javascript
export default Ember.Route.extend(ConfirmationMixin, {
  onUnload() {
    // my custom unload logic
  }
});
```

# Upgrading
This library underwent major API changes with version 1.0.0. For information on
how to upgrade, please check out [UPGRADING.md](https://github.com/jasonmit/ember-onbeforeunload/blob/master/UPGRADING.md).

# Issues
Found a bug? Please report it!

# Development Instructions

## Installing
* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

[npm]: https://www.npmjs.org/package/ember-onbeforeunload
[npm-badge]: https://img.shields.io/npm/v/ember-onbeforeunload.svg?style=flat-square
[travis]: https://travis-ci.org/jasonmit/ember-onbeforeunload
[travis-badge]: https://img.shields.io/travis/jasonmit/ember-onbeforeunload.svg?branch=master&style=flat-square
