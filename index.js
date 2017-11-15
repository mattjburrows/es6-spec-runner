const createBundler = require('./lib/createBundler');
const createDomEnvironment = require('./lib/createDomEnvironment');
const createScriptDependencies = require('./lib/createScriptDependencies');

module.exports = function bundleRunner(bundleOptions = {}) {
  const { input, output, scriptDependencies } = bundleOptions;
  const bundler = createBundler(input, output);
  const dependencies = createScriptDependencies(scriptDependencies);

  return (runnerOptions = {}) => {
    const domEnvironment = createDomEnvironment(runnerOptions, dependencies);

    if (!bundler) return domEnvironment(input.custom);
    return bundler
      .then(({ code }) => code)
      .then(domEnvironment);
  };
};
