import { load } from '@nexo-labs/pkl';
import type { config } from '../generated/config';
import path from 'path';

export default async function Home() {
  // Load configuration at build time (SSG)
  const config = await load(path.resolve('./config.pkl'));

  return (
    <div className="container">
      <h1>Next.js PKL Configuration Demo</h1>
      
      <div className="card">
        <h2>Application Info</h2>
        <p><strong>Name:</strong> {config.appName}</p>
        <p><strong>Version:</strong> {config.version}</p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Server Configuration</h3>
          <p><strong>Host:</strong> {config.server.host}</p>
          <p><strong>Port:</strong> {config.server.port}</p>
          <p><strong>SSL:</strong> {config.server.ssl ? 'Enabled' : 'Disabled'}</p>
        </div>

        <div className="card">
          <h3>Database Configuration</h3>
          <p><strong>URI:</strong> {config.database.uri}</p>
          <p><strong>Max Connections:</strong> {config.database.maxConnections}</p>
          <p><strong>Timeout:</strong> {config.database.timeout}s</p>
        </div>

        <div className="card">
          <h3>Feature Flags</h3>
          <p><strong>Authentication:</strong> {config.features.auth ? '✅' : '❌'}</p>
          <p><strong>Logging:</strong> {config.features.logging ? '✅' : '❌'}</p>
          <p><strong>Metrics:</strong> {config.features.metrics ? '✅' : '❌'}</p>
          <p><strong>Cache:</strong> {config.features.cache ? '✅' : '❌'}</p>
        </div>

        <div className="card">
          <h3>API Configuration</h3>
          <p><strong>Base URL:</strong> {config.api.baseUrl}</p>
          <p><strong>Timeout:</strong> {config.api.timeout}ms</p>
          <p><strong>Retries:</strong> {config.api.retries}</p>
        </div>

        <div className="card">
          <h3>UI Configuration</h3>
          <p><strong>Theme:</strong> {config.ui.theme}</p>
          <p><strong>Language:</strong> {config.ui.language}</p>
          <p><strong>Debug Info:</strong> {config.ui.showDebugInfo ? 'Shown' : 'Hidden'}</p>
        </div>
      </div>

      <div className="card">
        <h3>Raw Configuration (JSON)</h3>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>

      <div className="card">
        <h3>How This Works</h3>
        <p>This page demonstrates the PKL library in action:</p>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>Configuration is defined in <code>config.pkl</code></li>
          <li>TypeScript types are generated using <code>pkl-gen-ts</code></li>
          <li>Configuration is loaded at build time using <code>load()</code></li>
          <li>Full type safety is provided throughout the application</li>
        </ul>
      </div>
    </div>
  );
}