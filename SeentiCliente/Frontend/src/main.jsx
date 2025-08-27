import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './index.css';

// 🎨 TEMA OFICIAL DA SEENTI - IMPORTAÇÃO DIRETA
import './whiteLabel/themes/seentiOficial.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
