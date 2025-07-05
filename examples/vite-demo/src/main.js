import './style.css';
import config from '../config.pkl';

const app = document.querySelector('#app');
const configDiv = document.querySelector('#config');

// Mostrar la configuración
configDiv.innerHTML = `
  <h2>Configuración cargada desde PKL:</h2>
  <pre><code>${JSON.stringify(config, null, 2)}</code></pre>
  
  <h3>Usando la configuración:</h3>
  <div class="config-demo">
    <p><strong>Nombre de la App:</strong> ${config.appName}</p>
    <p><strong>Versión:</strong> ${config.version}</p>
    <p><strong>Entorno:</strong> ${config.environment}</p>
    <p><strong>Base de datos:</strong> ${config.database.host}:${config.database.port}</p>
    <p><strong>Modo oscuro:</strong> ${config.features.darkMode ? 'Activado' : 'Desactivado'}</p>
  </div>
`;

// Aplicar tema desde configuración
document.documentElement.style.setProperty('--primary-color', config.theme.primary);
document.documentElement.style.setProperty('--secondary-color', config.theme.secondary);

if (config.features.darkMode) {
  document.body.classList.add('dark-mode');
}

console.log('Configuración PKL cargada:', config); 