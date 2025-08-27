// src/components/common/SeentiFooter.jsx
import React, { useState } from 'react';
import { brand } from '../../whiteLabel/config/brandConfig';
import { getVersionInfo } from '../../config/version';
import ChangelogModal from './ChangelogModal';

export default function SeentiFooter() {
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <>
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
            <div className="seenti-footer-version-container">
              <p className="seenti-footer-version">
                {getVersionInfo().full}
              </p>
              <button
                onClick={() => setShowChangelog(true)}
                className="seenti-footer-changelog-btn"
                title="Ver changelog da versão"
              >
                📋 Changelog
              </button>
            </div>
            <p className="seenti-footer-copyright">
              © 2025 Seenti - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Changelog */}
      <ChangelogModal 
        isOpen={showChangelog} 
        onClose={() => setShowChangelog(false)} 
      />
    </>
  );
}


