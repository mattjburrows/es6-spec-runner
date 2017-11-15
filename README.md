# ES6 Spec Runner

- [What is this? And why make it?](#what-is-this-and-why-make-it)
- [Usage](#usage)
- [API](#api)
  - [Create the runner](#create-the-runner)
  - [Initialise the runner](#initialise-the-runner)

## What is this? And why make it?

## Usage
```js
const { bundleRunner } = require('es-spec-runner');

// When you want the runner to bundle your scripts
const runner = bundleRunner({
  input: 'this/is/the/file/location.js'
}, outputOptions);
// When you have already bundled your scripts
const runner = bundleRunner({
  bundle: 'window.foo = "bar";'
});

runner(runnerOptions).then(({ dom }) => {
  // query the dom
});
```

## API
### Create the runner
- `inputOptions` [Object] _required_ - Can consist of Rollup input options. Passing this in will bundle you scripts for you.
  - `bundle` [String] _optional_ - Pass in a pre-bundled script.
- `outputOptions` [Object] _optional_ - Can consist of Rollup output options. Passing this in will bundle you scripts for you.

### Initialise the runner
- `fixture` [String] _optional_ - Markup to inject into the DOM
- `polyfills` [Object] _optional_ - Map of polyfills to assign to the window scope
- `scriptDependencies` [Array] _optional_ - Array of file locations that are required for your input to run e.g. lib/util files
