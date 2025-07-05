// Simple test to verify webpack loader works in Next.js
import config from '../../../config.pkl';

export default function SimpleTest() {
  return (
    <div className="container">
      <h1>Simple Webpack Loader Test</h1>
      
      <div className="card">
        <h2>Loaded Configuration</h2>
        <p><strong>App Name:</strong> {config.appName}</p>
        <p><strong>Version:</strong> {config.version}</p>
        <p><strong>Server Port:</strong> {config.server.port}</p>
      </div>
      
      <div className="card">
        <h3>Full Configuration</h3>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>
    </div>
  );
}