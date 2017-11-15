const assert = require('assert');
const path = require('path');
const sinon = require('sinon');

const { bundleRunner } = require('../');

const sandbox = sinon.sandbox.create();
const yayquery = path.resolve(__dirname, '../examples/lib/yayquery.js');
const usesYayquery = path.resolve(__dirname, '../examples/usesYayquery.js');
const mathematics = path.resolve(__dirname, '../examples/mathematics.js');
const windowMethods = path.resolve(__dirname, '../examples/windowMethods.js');

describe('bundleRunner(inputOptions, outputOptions)', () => {
  afterEach(() => sandbox.restore());

  it('loads the bundleRunner({ input }) into the window on a modules property', () => {
    const bundle = bundleRunner({ input: mathematics });

    return bundle().then(({ dom }) => {
      assert.equal(typeof dom.window.__modules__.add, 'function');
      assert.equal(dom.window.__modules__.add(2), 4);
    });
  });

  it('loads the bundleRunner({ input }) into the window and returns the function', () => {
    const bundle = bundleRunner({ input: mathematics });

    return bundle().then(({ add }) => {
      assert.equal(typeof add, 'function');
      assert.equal(add(2), 4);
    });
  });

  it('adds bundleRunner({ bundle }) into the DOM', () => {
    const bundle = bundleRunner({ bundle: 'window.foo = "bar";' });

    return bundle({ fixture: '<div id="i-am-in-the-dom" />' }).then(({ dom: { window } }) => {
      assert.equal(window.foo, 'bar');
    });
  });

  it('adds bundleRunner({ scriptDependencies }) into the DOM', () => {
    const bundle = bundleRunner({
      input: usesYayquery,
      scriptDependencies: [yayquery]
    });
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

  it('adds the bundleRunner()({ fixture }) markup to the DOM', () => {
    const bundle = bundleRunner({ input: mathematics });

    return bundle({ fixture: '<div id="i-am-in-the-dom" />' }).then(({ dom: { window } }) => {
      assert.equal(
        window.document.querySelectorAll('#i-am-in-the-dom').length,
        1
      );
    });
  });

  it('adds bundleRunner()({ polyfills }) to the window', () => {
    const matchMediaStub = sandbox.stub().returns({ matches: false });
    const bundle = bundleRunner({ input: windowMethods });
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
