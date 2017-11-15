const assert = require('assert');
const path = require('path');
const sinon = require('sinon');

const bundleRunner = require('../');

const sandbox = sinon.sandbox.create();
const yayquery = path.resolve(__dirname, '../examples/lib/yayquery.js');
const usesYayquery = path.resolve(__dirname, '../examples/usesYayquery.js');
const mathematics = path.resolve(__dirname, '../examples/mathematics.js');
const windowMethods = path.resolve(__dirname, '../examples/windowMethods.js');

describe('bundleRunner(options)', () => {
  afterEach(() => sandbox.restore());

  it('loads bundleRunner({ input: { file } }) into the window on a modules property', () => {
    const options = {
      input: { file: mathematics }
    };
    const bundle = bundleRunner(options);

    return bundle().then(({ dom }) => {
      assert.equal(typeof dom.window.__modules__.add, 'function');
      assert.equal(dom.window.__modules__.add(2), 4);
    });
  });

  it('loads bundleRunner({ input: { file } }) into the window and returns the function', () => {
    const options = {
      input: { file: mathematics }
    };
    const bundle = bundleRunner(options);

    return bundle().then(({ add }) => {
      assert.equal(typeof add, 'function');
      assert.equal(add(2), 4);
    });
  });

  it('adds bundleRunner({ input: { custom } }) into the DOM', () => {
    const options = {
      input: { custom: 'window.foo = "bar";' }
    };
    const bundle = bundleRunner(options);

    return bundle({ fixture: '<div id="i-am-in-the-dom" />' }).then(({ dom: { window } }) => {
      assert.equal(window.foo, 'bar');
    });
  });

  it('adds bundleRunner({ scriptDependencies }) into the DOM', () => {
    const options = {
      input: { file: usesYayquery },
      scriptDependencies: [yayquery]
    };
    const bundle = bundleRunner(options);
    const runner = bundle({ fixture: '<div id="i-am-in-the-dom" />' });

    return runner.then(({ foo, bar, dom: { window } }) => {
      const element = window.document.querySelectorAll('#i-am-in-the-dom')[0];

      assert.strictEqual(element.classList.contains('foo'), false);
      foo(element, 'foo');

      assert.strictEqual(element.classList.contains('foo'), true);
      bar(element, 'foo');

      assert.strictEqual(element.classList.contains('foo'), false);
    });
  });

  it('adds bundleRunner({})({ fixture }) markup to the DOM', () => {
    const options = {
      input: { file: mathematics }
    };
    const bundle = bundleRunner(options);

    return bundle({ fixture: '<div id="i-am-in-the-dom" />' }).then(({ dom: { window } }) => {
      assert.equal(
        window.document.querySelectorAll('#i-am-in-the-dom').length,
        1
      );
    });
  });

  it('adds bundleRunner({})({ polyfills }) to the window', () => {
    const matchMediaStub = sandbox.stub().returns({ matches: false });
    const options = {
      input: { file: windowMethods }
    };
    const bundle = bundleRunner(options);
    const runner = bundle({
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
