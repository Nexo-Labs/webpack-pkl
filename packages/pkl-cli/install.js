const os = require('os');
const fs = require('fs');
const path = require('path');
const https = require('https');

const getPlatform = () => {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'darwin' && arch === 'arm64') {
    return 'macos-aarch64';
  } else if (platform === 'darwin' && arch === 'x64') {
    return 'macos-amd64';
  } else if (platform === 'linux' && arch === 'x64') {
    return 'linux-amd64';
  } else if (platform === 'linux' && arch === 'arm64') {
    return 'linux-aarch64';
  } else if (platform === 'win32' && arch === 'x64') {
    return 'windows-amd64';
  }

  return null;
};

const downloadFile = (url, dest, cb) => {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Handle redirect
      const redirectUrl = response.headers.location;
      console.log(`Redirecting to ${redirectUrl}`);
      downloadFile(redirectUrl, dest, cb);
      return;
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      cb(new Error(`Error downloading Pkl binary: GitHub returned status code ${response.statusCode}`));
      return;
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {}); // Delete the file
    cb(err);
  });
};

const main = async () => {
  try {
    const platform = getPlatform();
    const version = '0.28.2';
    const binDir = path.join(__dirname, 'bin');
    
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }

    if (platform) {
      // Try to download platform-specific binary
      const binaryName = os.platform() === 'win32' ? 'pkl.exe' : 'pkl';
      const pklPath = path.join(binDir, binaryName);

      if (fs.existsSync(pklPath)) {
        console.log('Pkl binary already exists.');
        return;
      }

      const url = `https://github.com/apple/pkl/releases/download/${version}/pkl-${platform}`;
      console.log(`Downloading Pkl binary from ${url}...`);

      downloadFile(url, pklPath, (err) => {
        if (err) {
          console.error(`Error downloading Pkl binary: ${err.message}`);
          console.log('Falling back to Java version...');
          downloadJavaFallback(version, binDir);
        } else {
          if (os.platform() !== 'win32') {
            fs.chmodSync(pklPath, '755');
          }
          console.log('Pkl binary is ready.');
        }
      });
    } else {
      console.log('Unsupported platform, downloading Java version...');
      downloadJavaFallback(version, binDir);
    }
  } catch (error) {
    console.error(`An unexpected error occurred: ${error.message}`);
    process.exit(1);
  }
};

const downloadJavaFallback = (version, binDir) => {
  const jarPath = path.join(binDir, 'pkl-cli-java.jar');
  
  if (fs.existsSync(jarPath)) {
    console.log('Java fallback already exists.');
    return;
  }

  const jarUrl = `https://github.com/apple/pkl/releases/download/${version}/pkl-cli-java-${version}.jar`;
  console.log(`Downloading Java fallback from ${jarUrl}...`);

  downloadFile(jarUrl, jarPath, (err) => {
    if (err) {
      console.error(`Error downloading Java fallback: ${err.message}`);
      console.error('Installation failed. Please install Pkl manually or ensure Java is available.');
      process.exit(1);
    } else {
      console.log('Java fallback is ready. Make sure Java is installed on your system.');
    }
  });
};

main();
