# PKL Integration Toolkit: Work in progress

Complete PKL configuration toolkit for Node.js, Next.js, and Vite applications with seamless integration.

## 🚀 Quick Start

### Next.js
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

### Vite
```bash
npm install @nexo-labs/vite-pkl-plugin
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import pklPlugin from '@nexo-labs/vite-pkl-plugin';

export default defineConfig({
  plugins: [pklPlugin()]
});
```

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| [@nexo-labs/pkl](./packages/pkl) | Main toolkit | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl) |
| [@nexo-labs/nextjs-pkl-plugin](./packages/nextjs-pkl-plugin) | Next.js plugin | ![npm](https://img.shields.io/npm/v/@nexo-labs/nextjs-pkl-plugin) |
| [@nexo-labs/vite-pkl-plugin](./packages/vite-pkl-plugin) | Vite plugin | ![npm](https://img.shields.io/npm/v/@nexo-labs/vite-pkl-plugin) |
| [@nexo-labs/pkl-webpack-loader](./packages/pkl-webpack-loader) | Webpack loader | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-webpack-loader) |
| [@nexo-labs/pkl-cli](./packages/pkl-cli) | Binary management | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-cli) |
| [@nexo-labs/pkl-eval](./packages/pkl-eval) | Configuration evaluator | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-eval) |
| [@nexo-labs/pkl-gen-ts](./packages/pkl-gen-ts) | TypeScript generator | ![npm](https://img.shields.io/npm/v/@nexo-labs/pkl-gen-ts) |

## ✨ Features

- ✅ **Automatic File Processing**: `config.pkl` → `config-types.ts` + `config.json`
- ✅ **Framework Integration**: Next.js, Vite, and Webpack support
- ✅ **Hot Reload**: Live updates when `.pkl` files change
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

## 🔥 Framework Integration

### Next.js
```javascript
// Direct import (with Next.js plugin)
import config from './config.pkl';
console.log(config.appName);
```

### Vite
```javascript
// Direct import (with Vite plugin)
import config from './config.pkl';
console.log(config.appName);
```

### Webpack
```javascript
// Direct import (with webpack loader)
import config from './config.pkl';
console.log(config.appName);
```

## 📖 Documentation

- [Next.js Plugin](./packages/nextjs-pkl-plugin/README.md)
- [Vite Plugin](./packages/vite-pkl-plugin/README.md)
- [Webpack Loader](./packages/pkl-webpack-loader/README.md)
- [API Reference](./packages/pkl/README.md)

## 🎯 Roadmap

- [x] Next.js plugin
- [x] Vite plugin
- [x] Webpack loader
- [ ] Increase integration with the JS/TS environment globaly, maybe someday

```javascript
import file from "./version.pkl" with { type: "pkl" };
```
```shell
package.pkl
package-lock.pkl
```

## 📄 License

MIT

---

Built with ❤️ for the PKL community
