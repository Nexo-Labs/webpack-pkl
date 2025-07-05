const { loadSync } = require('./index');
const { generate } = require('../pkl-gen-ts');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class PklFileProcessor {
  constructor(options = {}) {
    this.options = {
      watch: false,
      outputDir: null, // null means same directory as input
      generateTypes: true,
      generateJson: true,
      typesSuffix: '-types',
      ...options
    };
    this.watchers = new Map();
  }

  async processFile(inputPath) {
    const absolutePath = path.resolve(inputPath);
    const dir = this.options.outputDir || path.dirname(absolutePath);
    const baseName = path.basename(absolutePath, '.pkl');
    
    const outputs = {
      types: null,
      json: null,
      paths: {
        types: path.join(dir, `${baseName}${this.options.typesSuffix}.ts`),
        json: path.join(dir, `${baseName}.json`)
      }
    };

    try {
      // Generate JSON
      if (this.options.generateJson) {
        const config = loadSync(absolutePath);
        const jsonContent = JSON.stringify(config, null, 2);
        fs.writeFileSync(outputs.paths.json, jsonContent);
        outputs.json = config;
      }

      // Generate TypeScript types
      if (this.options.generateTypes) {
        const typesContent = await generate(absolutePath);
        fs.writeFileSync(outputs.paths.types, typesContent);
        outputs.types = typesContent;
      }

      return outputs;
    } catch (error) {
      throw new Error(`Failed to process ${inputPath}: ${error.message}`);
    }
  }

  async processDirectory(dirPath, pattern = '**/*.pkl') {
    const glob = require('glob');
    const files = glob.sync(pattern, { cwd: dirPath });
    
    const results = [];
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      try {
        const result = await this.processFile(fullPath);
        results.push({ file, success: true, result });
      } catch (error) {
        results.push({ file, success: false, error: error.message });
      }
    }
    
    return results;
  }

  watch(filePaths, callback) {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
    
    paths.forEach(filePath => {
      if (this.watchers.has(filePath)) {
        return; // Already watching
      }

      const watcher = chokidar.watch(filePath, {
        ignored: /node_modules/,
        persistent: true
      });

      watcher.on('change', async (path) => {
        try {
          const result = await this.processFile(path);
          if (callback) {
            callback(null, { path, result });
          }
        } catch (error) {
          if (callback) {
            callback(error, { path });
          }
        }
      });

      this.watchers.set(filePath, watcher);
    });

    return this;
  }

  stopWatching(filePath) {
    if (filePath) {
      const watcher = this.watchers.get(filePath);
      if (watcher) {
        watcher.close();
        this.watchers.delete(filePath);
      }
    } else {
      // Stop all watchers
      this.watchers.forEach(watcher => watcher.close());
      this.watchers.clear();
    }
  }

  static async quickProcess(inputPath, options = {}) {
    const processor = new PklFileProcessor(options);
    return await processor.processFile(inputPath);
  }
}

module.exports = { PklFileProcessor };