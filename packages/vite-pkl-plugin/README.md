# @nexo-labs/vite-pkl-plugin

Plugin de Vite para integración fluida con archivos de configuración PKL.

## 🚀 Características

- ✅ Carga automática de archivos `.pkl`
- ✅ Generación automática de tipos TypeScript
- ✅ Hot reload durante el desarrollo
- ✅ Soporte para build de producción
- ✅ Configuración flexible
- ✅ Compatibilidad con Vite 4.x y 5.x

## 📦 Instalación

```bash
npm install @nexo-labs/vite-pkl-plugin
# o
pnpm add @nexo-labs/vite-pkl-plugin
# o
yarn add @nexo-labs/vite-pkl-plugin
```

## 🛠️ Configuración

### Configuración Básica

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import pklPlugin from '@nexo-labs/vite-pkl-plugin';

export default defineConfig({
  plugins: [
    pklPlugin()
  ]
});
```

### Configuración Avanzada

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import pklPlugin from '@nexo-labs/vite-pkl-plugin';

export default defineConfig({
  plugins: [
    pklPlugin({
      // Archivos a incluir (regex)
      include: /\.pkl$/,
      
      // Archivos a excluir (regex)
      exclude: /node_modules/,
      
      // Generar tipos TypeScript
      generateTypes: true,
      
      // Directorio para los tipos generados
      outputDir: 'src/generated',
      
      // Habilitar watch en desarrollo
      watch: true
    })
  ]
});
```

## 📝 Uso

### 1. Crear un archivo PKL

```pkl
// config.pkl
appName = "Mi App"
version = "1.0.0"
database {
  host = "localhost"
  port = 5432
  name = "myapp"
}
features {
  darkMode = true
  notifications = false
}
```

### 2. Importar en tu aplicación

```typescript
// main.ts
import config from './config.pkl';

console.log(config.appName); // "Mi App"
console.log(config.database.host); // "localhost"
console.log(config.features.darkMode); // true
```

### 3. Usar los tipos generados (si generateTypes está habilitado)

```typescript
// main.ts
import config from './config.pkl';
import type { Config } from './generated/config';

const appConfig: Config = config;
```

## ⚙️ Opciones de Configuración

| Opción | Tipo | Defecto | Descripción |
|--------|------|---------|-------------|
| `include` | `RegExp` | `/\.pkl$/` | Patrón para archivos a incluir |
| `exclude` | `RegExp` | `undefined` | Patrón para archivos a excluir |
| `generateTypes` | `boolean` | `true` | Generar tipos TypeScript |
| `outputDir` | `string` | `'src/generated'` | Directorio para tipos generados |
| `watch` | `boolean` | `true` | Habilitar watch en desarrollo |

## 🔧 Integración con TypeScript

Para usar los tipos generados automáticamente, asegúrate de que tu `tsconfig.json` incluya el directorio de tipos generados:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/generated/*": ["src/generated/*"]
    }
  },
  "include": [
    "src/**/*",
    "src/generated/**/*"
  ]
}
```

## 🎯 Flujo de Trabajo

1. **Desarrollo**: Los archivos PKL se procesan automáticamente y se regeneran los tipos TypeScript cuando cambian
2. **Hot Reload**: Los cambios en archivos PKL se reflejan inmediatamente en la aplicación
3. **Build**: Durante el build, todos los archivos PKL se procesan y se incluyen en el bundle final

## 📚 Ejemplos

### Configuración de Entorno

```pkl
// env.pkl
environment = "development"
apiUrl = if (environment == "production") "https://api.example.com" else "http://localhost:3000"
debugMode = environment != "production"
```

### Configuración de Tema

```pkl
// theme.pkl
colors {
  primary = "#007bff"
  secondary = "#6c757d"
  success = "#28a745"
  danger = "#dc3545"
}
typography {
  fontFamily = "Inter, sans-serif"
  fontSize {
    small = "0.875rem"
    medium = "1rem"
    large = "1.25rem"
  }
}
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor abre un issue antes de enviar un PR.

## 📄 Licencia

MIT 