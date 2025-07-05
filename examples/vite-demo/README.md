# Ejemplo de Vite con PKL Plugin

Este es un ejemplo de cómo usar el plugin `@nexo-labs/vite-pkl-plugin` con Vite.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Build para producción
pnpm build
```

## 📁 Estructura del Proyecto

```
vite-demo/
├── config.pkl              # Archivo de configuración PKL
├── vite.config.js          # Configuración de Vite con el plugin PKL
├── index.html              # Archivo HTML principal
├── src/
│   ├── main.js             # Archivo principal que importa config.pkl
│   └── style.css           # Estilos CSS
└── package.json
```

## 🔧 Configuración

El plugin se configura en `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import pklPlugin from '@nexo-labs/vite-pkl-plugin';

export default defineConfig({
  plugins: [
    pklPlugin({
      generateTypes: true,
      outputDir: 'src/generated',
      watch: true
    })
  ]
});
```

## 📝 Uso

El archivo PKL se importa como cualquier otro módulo:

```javascript
import config from '../config.pkl';

console.log(config.appName); // "Vite PKL Demo"
console.log(config.database.host); // "localhost"
```

## ✨ Características Demostradas

- ✅ Importación directa de archivos `.pkl`
- ✅ Hot reload cuando cambias archivos PKL
- ✅ Generación automática de tipos TypeScript
- ✅ Aplicación de configuración en tiempo real
- ✅ Integración con el sistema de build de Vite 