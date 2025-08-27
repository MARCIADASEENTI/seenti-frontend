// src/components/common/SeentiFooter.jsx
import React from 'react';
import { brand } from '../../whiteLabel/config/brandConfig';

export default function SeentiFooter() {
  return (
    <footer className="seenti-footer">
      <div className="seenti-footer-content">
        {/* Logo e marca Seenti */}
        <div className="seenti-footer-brand">
          <img 
            src="/assets/seenti-design/logo-seenti-oficial.png"
            alt="Seenti - Terapia Integrativa"
            className="seenti-footer-logo"
          />
          <div className="seenti-footer-text">
            <span className="seenti-footer-powered">Powered by</span>
            <span className="seenti-footer-name">Seenti®</span>
          </div>
        </div>
        
        {/* Informações do sistema */}
        <div className="seenti-footer-info">
          <p className="seenti-footer-version">v1.0.0 - Sprint 08</p>
          <p className="seenti-footer-copyright">
            © 2025 Seenti - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}


