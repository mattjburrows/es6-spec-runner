const { JSDOM } = require('jsdom');

const DEFAULT_JSDOM_OPTS = { runScripts: 'outside-only' };

function createWindowPolyfills(polyfills) {
  return (window) => Object.assign(window, polyfills);
}

function createDom(fixture, polyfills) {
  const jsDomOptions = Object.assign(
    {},
    DEFAULT_JSDOM_OPTS,
    { beforeParse: createWindowPolyfills(polyfills) }
  );

  return new JSDOM(fixture, jsDomOptions);
}

module.exports = function createJsDomEnvironment(runnerOptions, dependencies) {
  const { fixture, polyfills } = runnerOptions;
  const dom = createDom(fixture, polyfills);

  return (code) => {
    dom.window.eval(`
      ${dependencies}
      ${code}
    `);

    return Promise.resolve(
      Object.assign(
        { dom },
        dom.window.__modules__
      )
    );
  };
}
