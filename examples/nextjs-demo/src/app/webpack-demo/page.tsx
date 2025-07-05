'use client';

import { useState, useEffect } from 'react';

export default function WebpackDemo() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  // For now, let's load the generated files directly
  // The webpack loader will be demonstrated separately
  
  useEffect(() => {
    // Load the generated JSON file
    fetch('/config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="container">
        <h1>Webpack Demo - Error</h1>
        <div className="card">
          <p>Error loading config: {error}</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="container">
        <h1>Webpack Demo - Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Webpack Integration Demo</h1>
      
      <div className="card">
        <h2>Configuration Loaded via Generated Files</h2>
        <p>This demonstrates the new workflow where:</p>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li><code>config.pkl</code> → <code>config-types.ts</code> + <code>config.json</code></li>
          <li>Files are automatically generated on PKL changes</li>
          <li>Types are available for import</li>
          <li>JSON is served statically</li>
        </ul>
      </div>

      <div className="card">
        <h3>Loaded Configuration:</h3>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>

      <div className="card">
        <h3>Available Commands:</h3>
        <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          <div>npm run pkl:process  # Generate types + JSON once</div>
          <div>npm run pkl:watch    # Watch and regenerate on changes</div>
        </div>
      </div>
    </div>
  );
}