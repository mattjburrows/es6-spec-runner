const { JSDOM } = require('jsdom');
const fs = require('fs');

const createBundler = require('./lib/createBundler');

const DEFAULT_JSDOM_OPTS = { runScripts: 'outside-only' };

function createEvalScript(code, scriptDependencies) {
  if (!scriptDependencies || !scriptDependencies.length) return code;

  const dependencies = scriptDependencies.reduce((accumulator, scriptDependency) => {
    return accumulator += fs.readFileSync(scriptDependency, 'utf-8');
  }, '');
  return (`${dependencies}\n\n${code}`);
}

function createWindowPolyfills(polyfills) {
  return (window) => Object.assign(window, polyfills);
}

function createDom(fixture, polyfills, scriptDependencies) {
  const jsDomOptions = Object.assign(
    {},
    DEFAULT_JSDOM_OPTS,
    { beforeParse: createWindowPolyfills(polyfills) }
  );

  return new JSDOM(fixture, jsDomOptions);
}

function createJsDomEnvironment(runnerOptions, scriptDependencies) {
  const { fixture, polyfills } = runnerOptions;
  const dom = createDom(fixture, polyfills, scriptDependencies);

  return ({ code }) => {
    dom.window.eval(createEvalScript(code, scriptDependencies));

    return Promise.resolve(
      Object.assign(
        { dom },
        dom.window.__modules__
      )
    );
  };
}

module.exports = {
  bundleRunner(inputOptions = {}, outputOptions = {}) {
    const { scriptDependencies, bundle } = inputOptions;
    const bundler = createBundler(inputOptions, outputOptions);

    return (runnerOptions = {}) => {
      const jsDomEnvironment = createJsDomEnvironment(runnerOptions, scriptDependencies);

      if (!bundler) return jsDomEnvironment({ code: bundle });
      return bundler.then(jsDomEnvironment);
    };
  }
};
