const { getPklPath, getPklPathSync } = require('@nexo-labs/pkl-cli');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const EventEmitter = require('events');

class PklEvaluationError extends Error {
  constructor(message, code, stderr) {
    super(message);
    this.name = 'PklEvaluationError';
    this.code = code;
    this.stderr = stderr;
  }
}

class PklWatcher extends EventEmitter {
  constructor(files, options = {}) {
    super();
    this.files = Array.isArray(files) ? files : [files];
    this.options = options;
    this.watcher = null;
    this.cache = new Map();
  }

  start() {
    this.watcher = chokidar.watch(this.files, {
      ignored: /node_modules/,
      persistent: true,
      ...this.options.watchOptions
    });

    this.watcher.on('change', async (filePath) => {
      try {
        const config = await load(filePath, this.options);
        this.emit('update', config, filePath);
      } catch (error) {
        this.emit('error', error, filePath);
      }
    });

    this.watcher.on('error', (error) => {
      this.emit('error', error);
    });

    return this;
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}

const cache = new Map();

const buildArgs = (options = {}) => {
  const args = ['eval', '-f', 'json'];
  
  if (options.expression) {
    args.push('-x', options.expression);
  }
  
  if (options.outputPath) {
    args.push('-o', options.outputPath);
  }

  return args;
};

const parseErrorMessage = (stderr) => {
  // Try to extract meaningful error information from Pkl CLI output
  const lines = stderr.split('\n').filter(line => line.trim());
  const errorLine = lines.find(line => line.includes('error:')) || lines[0];
  return errorLine || stderr;
};

const executePickle = async (args, input = null) => {
  const pklPath = await getPklPath();
  
  return new Promise((resolve, reject) => {
    const isJavaCommand = typeof pklPath === 'string' && pklPath.startsWith('java');
    let command, commandArgs;
    
    if (isJavaCommand) {
      [command, ...commandArgs] = pklPath.split(' ');
      commandArgs = [...commandArgs, ...args];
    } else {
      command = pklPath;
      commandArgs = args;
    }

    const pkl = spawn(command, commandArgs);

    let stdout = '';
    let stderr = '';

    pkl.stdout.on('data', (data) => {
      stdout += data;
    });

    pkl.stderr.on('data', (data) => {
      stderr += data;
    });

    if (input) {
      pkl.stdin.write(input);
      pkl.stdin.end();
    }

    pkl.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout));
        } catch (error) {
          reject(new PklEvaluationError(`Error parsing JSON output: ${error.message}`, code, stderr));
        }
      } else {
        const errorMessage = parseErrorMessage(stderr);
        reject(new PklEvaluationError(`Pkl evaluation failed: ${errorMessage}`, code, stderr));
      }
    });

    pkl.on('error', (error) => {
      reject(new PklEvaluationError(`Failed to spawn Pkl process: ${error.message}`, null, null));
    });
  });
};

const executePickleSync = (args, input = null) => {
  const pklPath = getPklPathSync();
  
  const isJavaCommand = typeof pklPath === 'string' && pklPath.startsWith('java');
  let command, commandArgs;
  
  if (isJavaCommand) {
    [command, ...commandArgs] = pklPath.split(' ');
    commandArgs = [...commandArgs, ...args];
  } else {
    command = pklPath;
    commandArgs = args;
  }

  const result = spawnSync(command, commandArgs, {
    input: input,
    encoding: 'utf8'
  });

  if (result.error) {
    throw new PklEvaluationError(`Failed to spawn Pkl process: ${result.error.message}`, null, null);
  }

  if (result.status !== 0) {
    const errorMessage = parseErrorMessage(result.stderr);
    throw new PklEvaluationError(`Pkl evaluation failed: ${errorMessage}`, result.status, result.stderr);
  }

  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new PklEvaluationError(`Error parsing JSON output: ${error.message}`, result.status, result.stderr);
  }
};

const load = async (filePath, options = {}) => {
  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    throw new PklEvaluationError(`File not found: ${absolutePath}`, null, null);
  }

  const cacheKey = `${absolutePath}:${JSON.stringify(options)}`;
  
  if (options.useCache !== false && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const args = [...buildArgs(options), absolutePath];
  const result = await executePickle(args);
  
  if (options.useCache !== false) {
    cache.set(cacheKey, result);
  }
  
  return result;
};

const loadSync = (filePath, options = {}) => {
  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    throw new PklEvaluationError(`File not found: ${absolutePath}`, null, null);
  }

  const cacheKey = `${absolutePath}:${JSON.stringify(options)}`;
  
  if (options.useCache !== false && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const args = [...buildArgs(options), absolutePath];
  const result = executePickleSync(args);
  
  if (options.useCache !== false) {
    cache.set(cacheKey, result);
  }
  
  return result;
};

const evaluate = async (source, options = {}) => {
  const cacheKey = `source:${source}:${JSON.stringify(options)}`;
  
  if (options.useCache !== false && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // For inline evaluation, we need to create a temporary file
  const fs = require('fs');
  const os = require('os');
  const tempFile = path.join(os.tmpdir(), `pkl-eval-${Date.now()}.pkl`);
  
  try {
    fs.writeFileSync(tempFile, source);
    const args = [...buildArgs(options), tempFile];
    const result = await executePickle(args);
    
    if (options.useCache !== false) {
      cache.set(cacheKey, result);
    }
    
    return result;
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
};

const evaluateSync = (source, options = {}) => {
  const cacheKey = `source:${source}:${JSON.stringify(options)}`;
  
  if (options.useCache !== false && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // For inline evaluation, we need to create a temporary file
  const fs = require('fs');
  const os = require('os');
  const tempFile = path.join(os.tmpdir(), `pkl-eval-sync-${Date.now()}.pkl`);
  
  try {
    fs.writeFileSync(tempFile, source);
    const args = [...buildArgs(options), tempFile];
    const result = executePickleSync(args);
    
    if (options.useCache !== false) {
      cache.set(cacheKey, result);
    }
    
    return result;
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
};

const createWatcher = (files, options = {}) => {
  const watcher = new PklWatcher(files, options);
  return watcher.start();
};

const clearCache = () => {
  cache.clear();
};

module.exports = {
  load,
  loadSync,
  evaluate,
  evaluateSync,
  createWatcher,
  clearCache,
  PklEvaluationError
};
