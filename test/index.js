const assert = require('assert');
const path = require('path');
const sinon = require('sinon');

const { bundleRunner } = require('../');

const sandbox = sinon.sandbox.create();
const mathematics = path.resolve(__dirname, '../examples/mathematics.js');
const windowMethods = path.resolve(__dirname, '../examples/windowMethods.js');

describe('bundleRunner(inputOptions, outputOptions)', () => {
  afterEach(() => sandbox.restore());

  it('loads the scripts into the window on a modules property', () => {
    const bundle = bundleRunner({ input: mathematics });
    return bundle().then(({ dom }) => {
      assert.equal(typeof dom.window.__modules__.add, 'function');
      assert.equal(dom.window.__modules__.add(2), 4);
    });
  });

  it('loads the scripts into the window and returns the function', () => {
    const bundle = bundleRunner({ input: mathematics });
    return bundle().then(({ add }) => {
      assert.equal(typeof add, 'function');
      assert.equal(add(2), 4);
    });
  });

  it('adds the fixture markup to the dom', () => {
    const bundle = bundleRunner({ input: mathematics });

    return bundle('<div id="i-am-in-the-dom" />').then(({ dom: { window } }) => {
      assert.equal(
        window.document.querySelectorAll('#i-am-in-the-dom').length,
        1
      );
    });
  });

  it('adds polyfills to the window', () => {
    const matchMediaStub = sandbox.stub().returns({ matches: false });
    const bundle = bundleRunner({ input: windowMethods });
    const runner = bundle('', {
      polyfills: {
        matchMedia: matchMediaStub
      }
    });
    
    matchMediaStub.withArgs('(min-width: 1280px)').returns({ matches: true });

    return runner.then(({ dom, getBreakpoint }) => {
      assert.equal(dom.window.matchMedia, matchMediaStub);
      assert.equal(getBreakpoint(), 5);
    });
  });
})
