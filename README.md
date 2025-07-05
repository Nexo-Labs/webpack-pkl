# Next.js PKL Integration

Complete PKL configuration toolkit for Node.js and Next.js applications with webpack integration.

## 🚀 Quick Start

```bash
npm install @nexo-labs/nextjs-pkl-plugin
```

```javascript
// next.config.js
const withPkl = require('@nexo-labs/nextjs-pkl-plugin');

module.exports = withPkl({
  // Your existing Next.js config
});
```

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| [@nexo-labs/pkl](./packages/pkl) | Main toolkit | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl) |
| [@nexo-labs/pkl-webpack-loader](./packages/pkl-webpack-loader) | Webpack loader | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-webpack-loader) |
| [@nexo-labs/nextjs-pkl-plugin](./packages/nextjs-pkl-plugin) | Next.js plugin | ![npm](https://img.shields.io/npm/v/@nexo-labs/nextjs-pkl-plugin) |
| [@nexo-labs/pkl-cli](./packages/pkl-cli) | Binary management | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-cli) |
| [@nexo-labs/pkl-eval](./packages/pkl-eval) | Configuration evaluator | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-eval) |
| [@nexo-labs/pkl-gen-ts](./packages/pkl-gen-ts) | TypeScript generator | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-gen-ts) |

## ✨ Features

- ✅ **Automatic File Processing**: `config.pkl` → `config-types.ts` + `config.json`
- ✅ **Webpack Integration**: Hot reload when `.pkl` files change
- ✅ **Zero Configuration**: Just install and use
- ✅ **TypeScript Support**: Full type safety with generated definitions
- ✅ **Cross-platform**: Works on Windows, macOS, and Linux
- ✅ **File Watching**: Live updates during development

## 🛠 Usage

### 1. Basic Configuration

```pkl
// config.pkl
appName = "My App"
version = "1.0.0"

server {
  host = "localhost"
  port = 3000
}

database {
  uri = "postgres://user:pass@localhost/db"
  maxConnections = 20
}
```

### 2. Generate Types & JSON

```bash
npx pkl-process config.pkl
```

Generates:
- `config-types.ts` - TypeScript definitions
- `config.json` - Compiled JSON

### 3. Use in Your App

```typescript
import type { Config } from './config-types';
import { load } from '@nexo-labs/pkl';

// Load with full type safety
const config = await load<Config>('./config.pkl');
console.log(config.server.port); // TypeScript knows this is a number
```

## 🔥 Webpack Integration

The webpack loader automatically processes PKL files:

```javascript
// Direct import (with webpack loader)
import config from './config.pkl';

// config is automatically compiled and typed
console.log(config.appName);
```

## 📖 Documentation

- [Webpack Loader](./packages/pkl-webpack-loader/README.md)
- [Next.js Plugin](./packages/nextjs-pkl-plugin/README.md)
- [API Reference](./packages/pkl/README.md)

## 🎯 Roadmap

- [ ] WebAssembly runtime
- [ ] Vite plugin
- [ ] Rich type bindings (Duration, DataSize)
- [ ] VS Code extension

## 📄 License

MIT

---

Built with ❤️ for the PKL community