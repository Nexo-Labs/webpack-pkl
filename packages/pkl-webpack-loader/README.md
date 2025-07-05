# @nexo-labs/pkl-webpack-loader

Webpack loader for PKL configuration files with automatic TypeScript generation.

## Installation

```bash
npm install @nexo-labs/pkl-webpack-loader
```

## Usage

### Webpack Configuration

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.pkl$/,
        use: '@nexo-labs/pkl-webpack-loader'
      }
    ]
  }
};
```

### Import PKL Files

```javascript
// Import PKL file directly
import config from './config.pkl';

console.log(config); // Compiled JSON configuration
```

## Features

- ✅ Automatic PKL → JSON compilation
- ✅ TypeScript definitions generation  
- ✅ Hot reload support
- ✅ File watching for development

## Generated Files

For each PKL file, the loader generates:
- `config-types.ts` - TypeScript definitions
- `config.json` - Compiled JSON

## License

MIT