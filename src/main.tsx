import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
/**import 'bootstrap/dist/css/bootstrap.min.css';**/
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root');

const root = ReactDOM.createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

reportWebVitals();
