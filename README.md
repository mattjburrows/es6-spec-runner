# ES6 Spec Runner

- [What is this? And why make it?](#what-is-this-and-why-make-it)
- [Usage](#usage)
- [API](#api)
  - [Create the runner](#create-the-runner)
  - [Initialise the runner](#initialise-the-runner)

## What is this? And why make it?
This package has been developed to provide a lightweight spec runner to generate an environment to unit/integration test your ES[6||2015] code.

It uses [Rollup](https://rollupjs.org) to compile your code and adds it to a [JSDOM](https://github.com/tmpvar/jsdom) environment. You can also precompile your code and pass that in if you prefer use your own.

This package has been developed due to difficulties in unit/integration testing ES[6||2015]. Most of this issues we encountered were around stubbing and spying on dependencies.

## Usage

**With the package bundling your scripts**
```js
const { bundleRunner } = require('es-spec-runner');
const runner = bundleRunner({
  input: { file: 'this/is/the/file/location.js' },
  output: { },
  scriptDependencies: [ ]
});

runner({
  polyfills: {},
  fixture: '<div />'
}).then(({ dom }) => { /* run your assertions */ });
```

**Providing your own custom bundle**
```js
const { bundleRunner } = require('es-spec-runner');
const runner = bundleRunner({
  input: { custom: 'window.foo = "bar";' },
  output: { },
  scriptDependencies: [ ]
});

runner({
  polyfills: {},
  fixture: '<div />'
}).then(({ dom }) => { /* run your assertions */ });
```

## API
### Create the runner
- `options` [Object] _required_ - Consists of the following:
  - `input` [Object] _required_ - Can consist of Rollup input options. Passing this in will bundle you scripts for you.
    - `file` [String] _required_ (when not providing a `custom` value) - File path of the script to bundle.
    - `custom` [String] _required_ (when not providing a `file` value) - Pass in a pre-bundled script, and skip over the package automatically bundling for you.
  - `output` [Object] _optional_ - Can consist of Rollup output options. Passing this in will bundle you scripts for you.
  - `scriptDependencies` [Array] _optional_ - Array of file locations that are required for your input to run e.g. lib/util files.

### Initialise the runner
- `fixture` [String] _optional_ - Markup to inject into the DOM.
- `polyfills` [Object] _optional_ - Map of polyfills to assign to the window scope. Can also be used for stubbing / spying external dependencies.
