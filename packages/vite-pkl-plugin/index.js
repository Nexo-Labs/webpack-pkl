const { evaluateFile, watchFile } = require('@nexo-labs/pkl-eval');
const { generateTypeScript } = require('@nexo-labs/pkl-gen-ts');
const path = require('path');
const fs = require('fs');

function pklPlugin(options = {}) {
  const {
    include = /\.pkl$/,
    exclude,
    generateTypes = true,
    outputDir = 'src/generated',
    watch = true
  } = options;

  let isProduction = false;
  let watchedFiles = new Set();
  
  const ensureOutputDir = () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  };

  const processFile = async (filePath) => {
    try {
      const result = await evaluateFile(filePath);
      
      if (generateTypes) {
        ensureOutputDir();
        const fileName = path.basename(filePath, '.pkl');
        const tsPath = path.join(outputDir, `${fileName}.ts`);
        await generateTypeScript(filePath, tsPath);
      }
      
      return result;
    } catch (error) {
      console.error(`Error procesando archivo PKL ${filePath}:`, error);
      throw error;
    }
  };

  return {
    name: 'pkl-plugin',
    
    configResolved(config) {
      isProduction = config.command === 'build';
    },

    buildStart() {
      if (generateTypes) {
        ensureOutputDir();
      }
    },

    resolveId(id) {
      if (include.test(id)) {
        return id;
      }
      return null;
    },

    async load(id) {
      if (!include.test(id)) {
        return null;
      }

      if (exclude && exclude.test(id)) {
        return null;
      }

      const filePath = path.resolve(id);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }

      try {
        const config = await processFile(filePath);
        
        if (!isProduction && watch) {
          watchedFiles.add(filePath);
        }
        
        return `export default ${JSON.stringify(config, null, 2)};`;
      } catch (error) {
        this.error(`Error cargando archivo PKL ${id}: ${error.message}`);
      }
    },

    async handleHotUpdate({ file, server }) {
      if (include.test(file)) {
        try {
          await processFile(file);
          
          const modules = server.moduleGraph.getModulesByFile(file);
          if (modules) {
            return [...modules];
          }
        } catch (error) {
          server.ws.send({
            type: 'error',
            err: {
              message: `Error actualizando archivo PKL ${file}: ${error.message}`,
              stack: error.stack
            }
          });
        }
      }
    },

    buildEnd() {
      if (watch) {
        watchedFiles.forEach(filePath => {
          if (fs.existsSync(filePath)) {
            watchFile(filePath, async () => {
              try {
                await processFile(filePath);
              } catch (error) {
                console.error(`Error en watch de ${filePath}:`, error);
              }
            });
          }
        });
      }
    }
  };
}

module.exports = pklPlugin;
module.exports.default = pklPlugin; 