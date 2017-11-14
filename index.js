const { JSDOM } = require('jsdom');
const rollup = require('rollup');

const BUNDLE_OUTPUT_OPTS = { format: 'iife', name: '__modules__' };
const DEFAULT_JSDOM_OPTS = { runScripts: 'outside-only' };

function buildBundler(inputOptions, outputOptions) {
  return rollup
    .rollup(inputOptions)
    .then((bundle) => {
      return bundle.generate(Object.assign(
        {},
        BUNDLE_OUTPUT_OPTS,
        outputOptions
      ));
    });
}

function bindPolyfillsToWindow(polyfills) {
  return (window) => {
    if (!polyfills) return;

    Object.keys(polyfills).reduce((accumulator, polyfill) => {
      accumulator[polyfill] = polyfills[polyfill];
      return accumulator;
    }, window);
  };
}

function bundleRunner(inputOptions, outputOptions) {
  const bundler = buildBundler(inputOptions, outputOptions);

  return (fixture, runnerOptions = {}) => {
    const dom = new JSDOM(
      fixture,
      Object.assign(
        { beforeParse: bindPolyfillsToWindow(runnerOptions.polyfills) },
        DEFAULT_JSDOM_OPTS
      )
    );

    return bundler.then(({ code }) => {
      dom.window.eval(code);

      return Promise.resolve(
        Object.assign(
          { dom },
          dom.window.__modules__
        )
      );
    });
  };
}

module.exports = { bundleRunner };
