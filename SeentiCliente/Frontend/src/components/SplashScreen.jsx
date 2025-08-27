// src/components/SplashScreen.jsx - Sprint 08 - Tela de Splash Profissional
// Tela de splash otimizada com logo oficial Seenti e animações profissionais
// ✅ INTEGRADA AO SISTEMA WHITE LABEL

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { brand } from '../whiteLabel/config/brandConfig';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sequência de animações
    const sequence = async () => {
      // 1. Logo aparece com fade in
      await new Promise(resolve => setTimeout(resolve, 300));
      setLogoLoaded(true);
      
      // 2. Texto aparece com slide up
      await new Promise(resolve => setTimeout(resolve, 500));
      setTextVisible(true);
      
      // 3. Loading aparece
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoadingVisible(true);
      
      // 4. Aguarda carregamento e inicia fade out
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsVisible(false);
      
      // 5. Navega para login
      setTimeout(() => {
        navigate("/login");
      }, 500);
    };

    sequence();
  }, [navigate]);

  return (
    <div className={`fixed inset-0 seenti-bg-gradient flex items-center justify-center transition-all duration-1000 overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center px-6 w-full max-w-sm">
        {/* Logo Seenti Oficial - SIMPLES E PROFISSIONAL */}
        <div className={`mb-6 transition-all duration-1000 ${logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="w-24 h-24 mx-auto mb-4 seenti-bg-white seenti-rounded-full flex items-center justify-center seenti-shadow-lg">
            <img 
              src={brand?.logo || "/assets/seenti-design/logo-seenti-oficial.png"}
              alt={`${brand?.name || 'Seenti'} - Logo Oficial`}
              className="w-20 h-20 object-contain"
              onLoad={() => setLogoLoaded(true)}
              onError={() => {
                setLogoLoaded(true);
                console.log('Logo carregado com fallback');
              }}
            />
          </div>
        </div>

        {/* Nome da marca - SIMPLES */}
        <div className={`transition-all duration-1000 delay-300 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl font-bold seenti-text-white mb-3 tracking-wider">
            {brand?.name || 'Seenti'}
          </h1>
          <p className="text-lg seenti-text-white/90 font-medium">
            {brand?.tagline || 'Terapia Integrativa'}
          </p>
        </div>

        {/* Loading simples - PROFISSIONAL */}
        <div className={`transition-all duration-1000 delay-500 ${loadingVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-32 h-1 seenti-bg-white/20 seenti-rounded-full mx-auto mb-4">
            <div className="h-full seenti-bg-white seenti-rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="seenti-text-white/80 text-sm font-medium">
            Carregando...
          </p>
        </div>

        {/* Copyright discreto */}
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-700 ${loadingVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="seenti-text-white/60 text-xs">
            © 2025 {brand?.poweredBy || 'Seenti®'}
          </p>
        </div>
      </div>
    </div>
  );
}

