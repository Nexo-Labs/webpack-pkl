const path = require('path');
const fs = require('fs');
const os = require('os');

const getPklPath = async () => {
  const platform = os.platform();
  const arch = os.arch();
  
  // Get platform-specific binary name
  let binaryName = 'pkl';
  if (platform === 'win32') {
    binaryName = 'pkl.exe';
  }
  
  const binDir = path.join(__dirname, 'bin');
  const pklPath = path.join(binDir, binaryName);

  if (fs.existsSync(pklPath)) {
    return pklPath;
  }

  // Check for Java fallback
  const jarPath = path.join(binDir, 'pkl-cli-java.jar');
  if (fs.existsSync(jarPath)) {
    // Check if Java is available
    const { spawn } = require('child_process');
    try {
      await new Promise((resolve, reject) => {
        const java = spawn('java', ['-version']);
        java.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error('Java not found'));
        });
        java.on('error', reject);
      });
      return `java -jar ${jarPath}`;
    } catch (error) {
      throw new Error('Pkl binary not found and Java fallback is not available. Please ensure Java is installed.');
    }
  }

  throw new Error('Pkl binary not found. Please run: npm install');
};

const getPklPathSync = () => {
  const platform = os.platform();
  
  let binaryName = 'pkl';
  if (platform === 'win32') {
    binaryName = 'pkl.exe';
  }
  
  const binDir = path.join(__dirname, 'bin');
  const pklPath = path.join(binDir, binaryName);

  if (fs.existsSync(pklPath)) {
    return pklPath;
  }

  // Check for Java fallback
  const jarPath = path.join(binDir, 'pkl-cli-java.jar');
  if (fs.existsSync(jarPath)) {
    return `java -jar ${jarPath}`;
  }

  throw new Error('Pkl binary not found. Please run: npm install');
};

module.exports = { getPklPath, getPklPathSync };
