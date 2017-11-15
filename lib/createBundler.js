const rollup = require('rollup');

const BUNDLE_OUTPUT_OPTS = { format: 'iife', name: '__modules__' };
const BUNDLE_INPUT_MAPPINGS = { file: 'input' };

function mapInputOptionsToRollupOptions(input) {
  return Object.keys(input).reduce((accumulator, i) => {
    const key = BUNDLE_INPUT_MAPPINGS[i] || i;

    return Object.assign(
      {},
      accumulator,
      { [key] : input[i] }
    );
  }, {});
}

module.exports = function createBundler(input, output) {
  if (input.custom) return;

  return rollup
    .rollup(mapInputOptionsToRollupOptions(input))
    .then((bundle) => {
      return bundle.generate(Object.assign(
        {},
        output,
        BUNDLE_OUTPUT_OPTS
      ));
    });
};
