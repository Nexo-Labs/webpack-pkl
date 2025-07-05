const path = require('path');
const fs = require('fs');

// Mock webpack loader context
const mockContext = {
  async: () => (error, result) => {
    if (error) {
      console.error('Webpack loader error:', error);
      process.exit(1);
    } else {
      console.log('Webpack loader result:');
      console.log(result);
      
      // Check if files were generated
      const dir = path.dirname(path.resolve('config.pkl'));
      const baseName = path.basename('config.pkl', '.pkl');
      const typesPath = path.join(dir, `${baseName}-types.ts`);
      const jsonPath = path.join(dir, `${baseName}.json`);
      
      console.log('\nGenerated files:');
      console.log('Types file exists:', fs.existsSync(typesPath));
      console.log('JSON file exists:', fs.existsSync(jsonPath));
      
      if (fs.existsSync(typesPath)) {
        console.log('\nTypes file content:');
        console.log(fs.readFileSync(typesPath, 'utf8'));
      }
      
      if (fs.existsSync(jsonPath)) {
        console.log('\nJSON file content:');
        console.log(fs.readFileSync(jsonPath, 'utf8'));
      }
    }
  },
  resourcePath: path.resolve('config.pkl'),
  addDependency: (dep) => console.log('Added dependency:', dep)
};

// Test the webpack loader
console.log('Testing webpack loader...');
const loader = require('../../packages/pkl-webpack-loader');

// Read the PKL file content
const source = fs.readFileSync('config.pkl', 'utf8');

// Execute the loader
loader.call(mockContext, source);