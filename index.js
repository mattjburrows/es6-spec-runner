const { JSDOM } = require('jsdom');
const rollup = require('rollup');
const fs = require('fs');

const BUNDLE_OUTPUT_OPTS = { format: 'iife', name: '__modules__' };
const DEFAULT_JSDOM_OPTS = { runScripts: 'outside-only' };

function mergeScriptDependencies(scriptDependencies) {
  return (accumulator, scriptDependency) => {
    accumulator += fs.readFileSync(scriptDependency, 'utf-8');
    return accumulator;
  };
}

function createEvalScript(code, scriptDependencies = []) {
  if (!scriptDependencies.length) return code;

  const dependencies = scriptDependencies.reduce(mergeScriptDependencies(scriptDependencies), '');
  return (`${dependencies}\n\n${code}`);
}

function createWindowPolyfills(polyfills = {}) {
  return (window) => {
    Object.assign(window, polyfills);
  };
}

function createBundler(inputOptions, outputOptions) {
  if (inputOptions.bundle) return;
  
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

function createDom({ fixture, polyfills, scriptDependencies }) {
  const jsDomOptions = Object.assign(
    {},
    DEFAULT_JSDOM_OPTS,
    { beforeParse: createWindowPolyfills(polyfills) }
  );

  return new JSDOM(fixture, jsDomOptions);
}

function createJsDomEnvironment(runnerOptions) {
  const dom = createDom(runnerOptions);

  return ({ code }) => {
    dom.window.eval(createEvalScript(code, runnerOptions.scriptDependencies));

    return Promise.resolve(
      Object.assign(
        { dom },
        dom.window.__modules__
      )
    );
  };
}

function bundleRunner(inputOptions = {}, outputOptions = {}) {
  const bundler = createBundler(inputOptions, outputOptions);

  return (runnerOptions = {}) => {
    const jsDomEnvironment = createJsDomEnvironment(runnerOptions);

    if (!bundler) return jsDomEnvironment({ code: inputOptions.bundle });
    return bundler.then(jsDomEnvironment);
  };
}

module.exports = { bundleRunner };
