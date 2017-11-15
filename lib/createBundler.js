const rollup = require('rollup');

const BUNDLE_OUTPUT_OPTS = { format: 'iife', name: '__modules__' };
const BUNDLE_OPTS_WHITELIST = [
  'acorn',
  'amd',
  'banner',
  'cache',
  'context',
  'entry',
  'exports',
  'extend',
  'external',
  'file',
  'footer',
  'format',
  'globals',
  'indent',
  'input',
  'interop',
  'intro',
  'legacy',
  'moduleContext',
  'name',
  'noConflict',
  'onwarn',
  'output',
  'outro',
  'paths',
  'plugins',
  'preferConst',
  'pureExternalModules',
  'sourcemap',
  'sourcemapFile',
  'strict',
  'targets',
  'treeshake',
  'watch'
];

function filterBundleInputOptions(inputOptions) {
  return Object.keys(inputOptions).reduce((accumulator, inputOption) => {
    if (BUNDLE_OPTS_WHITELIST.includes(inputOption)) {
      return Object.assign(
        {},
        accumulator,
        { [inputOption]: inputOptions[inputOption] }
      );
    }
    return accumulator;
  }, {});
}

module.exports = function createBundler(inputOptions, outputOptions) {
  if (inputOptions.bundle) return;

  return rollup
    .rollup(filterBundleInputOptions(inputOptions))
    .then((bundle) => {
      return bundle.generate(Object.assign(
        {},
        BUNDLE_OUTPUT_OPTS,
        outputOptions
      ));
    });
};
