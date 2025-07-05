# @nexo-labs/nextjs-pkl-plugin

Next.js plugin for seamless PKL configuration integration.

## Installation

```bash
npm install @nexo-labs/nextjs-pkl-plugin
```

## Usage

### Next.js Configuration

```javascript
// next.config.js
const withPkl = require('@nexo-labs/nextjs-pkl-plugin');

module.exports = withPkl({
  // Your existing Next.js config
});
```

### Import PKL Files in Components

```typescript
// Import generated types
import type { Config } from './config-types';

// Load configuration
import { load } from '@nexo-labs/pkl';

export default async function Page() {
  const config = await load<Config>('./config.pkl');
  
  return <div>{config.appName}</div>;
}
```

## Features

- ✅ Automatic webpack configuration
- ✅ Hot reload for PKL files
- ✅ TypeScript support
- ✅ Zero configuration setup

## Generated Files

- `config-types.ts` - TypeScript definitions
- `config.json` - Compiled JSON configuration

## License

MIT