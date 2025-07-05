const { loadSync } = require('@nexo-labs/pkl-eval');
const { generate } = require('@nexo-labs/pkl-gen-ts');
const fs = require('fs');
const path = require('path');

/**
 * Webpack loader for PKL files
 * Transforms foo.pkl into:
 * - foo-types.ts (TypeScript definitions)
 * - foo.json (compiled JSON)
 * - Returns ES module that exports both
 */
module.exports = function pklLoader(source) {
  const callback = this.async();
  const resourcePath = this.resourcePath;
  const outputDir = path.dirname(resourcePath);
  const baseName = path.basename(resourcePath, '.pkl');
  
  // Generate output file paths
  const typesPath = path.join(outputDir, `${baseName}-types.ts`);
  const jsonPath = path.join(outputDir, `${baseName}.json`);
  
  // Add file dependencies for hot reload
  this.addDependency(resourcePath);
  
  const processFile = async () => {
    try {
      // 1. Load and evaluate PKL to JSON
      const config = loadSync(resourcePath);
      
      // 2. Generate TypeScript definitions
      const typesCode = await generate(resourcePath);
      
      // 3. Write files
      fs.writeFileSync(jsonPath, JSON.stringify(config, null, 2));
      fs.writeFileSync(typesPath, typesCode);
      
      // 4. Add generated files as dependencies for webpack watching
      this.addDependency(typesPath);
      this.addDependency(jsonPath);
      
      // 5. Return ES module that exports both the config and types
      const moduleCode = `
// Auto-generated from ${path.basename(resourcePath)}
import configData from './${baseName}.json';
import * as configTypes from './${baseName}-types';

export default configData;
export const config = configData;
export const types = configTypes;

// For debugging
export const __pklSource = ${JSON.stringify(resourcePath)};
export const __generatedAt = ${JSON.stringify(new Date().toISOString())};
      `.trim();
      
      callback(null, moduleCode);
      
    } catch (error) {
      callback(error);
    }
  };
  
  processFile();
};

// Raw loader - we handle the source ourselves
module.exports.raw = false;