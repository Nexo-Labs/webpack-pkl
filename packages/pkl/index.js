const { 
  load, 
  loadSync, 
  evaluate, 
  evaluateSync, 
  createWatcher, 
  clearCache,
  PklEvaluationError 
} = require('@nexo-labs/pkl-eval');

const { generate: generateTypes, PklTypeGenerator } = require('@nexo-labs/pkl-gen-ts');

module.exports = {
  // Core evaluation functions
  load,
  loadSync,
  evaluate,
  evaluateSync,
  
  // Utility functions
  createWatcher,
  clearCache,
  
  // TypeScript generation
  generateTypes,
  PklTypeGenerator,
  
  // Error class
  PklEvaluationError,
  
  // Legacy alias for backward compatibility
  evaluate: evaluate
};
