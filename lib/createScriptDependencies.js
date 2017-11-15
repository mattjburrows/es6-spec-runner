const fs = require('fs');

module.exports = function createEvalScript(scriptDependencies) {
  if (!scriptDependencies || !scriptDependencies.length) return;

  return scriptDependencies.reduce((accumulator, scriptDependency) => {
    return accumulator += fs.readFileSync(scriptDependency, 'utf-8');
  }, '');
}
