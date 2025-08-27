// src/components/SplashScreen.jsx - Sprint 08 - Tela de Splash Profissional
// Tela de splash otimizada com layout unificado e responsividade total
// ✅ INTEGRADA AO SISTEMA WHITE LABEL - VERSÃO MELHORADA

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { brand } from '../whiteLabel/config/brandConfig';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Sequência de animações melhorada
    const sequence = async () => {
      // 1. Logo aparece com fade in
      await new Promise(resolve => setTimeout(resolve, 300));
      setLogoLoaded(true);
      
      // 2. Texto aparece com slide up
      await new Promise(resolve => setTimeout(resolve, 500));
      setTextVisible(true);
      
      // 3. Loading aparece com progresso
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoadingVisible(true);
      
      // 4. Progresso animado
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      
      // 5. Aguarda progresso completo e inicia fade out
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsVisible(false);
      
      // 6. Navega para login
      setTimeout(() => {
        navigate("/login");
      }, 500);
    };

    sequence();
  }, [navigate]);

  return (
    <div className={`fixed inset-0 seenti-bg-gradient-splash flex items-center justify-center transition-all duration-1000 overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Pattern Sutil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/5 to-transparent"></div>
      </div>

      {/* Container Principal - Layout Unificado */}
      <div className="relative z-10 text-center px-6 w-full max-w-md mx-auto">
        {/* Logo Seenti Oficial - Centralizado e Responsivo */}
        <div className={`mb-8 transition-all duration-1000 ${logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 seenti-bg-white/95 seenti-rounded-full flex items-center justify-center seenti-shadow-xl backdrop-blur-sm">
            <img 
              src={brand?.logo || "/assets/seenti-design/logo-seenti-oficial.png"}
              alt={`${brand?.name || 'Seenti'} - Logo Oficial`}
              className="w-24 h-24 md:w-28 md:h-28 object-contain"
              onLoad={() => setLogoLoaded(true)}
              onError={() => {
                setLogoLoaded(true);
                console.log('Logo carregado com fallback');
              }}
            />
          </div>
        </div>

        {/* Nome da marca - Tipografia Melhorada */}
        <div className={`transition-all duration-1000 delay-300 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-6xl font-bold seenti-text-white mb-4 tracking-wider drop-shadow-lg">
            {brand?.name || 'Seenti'}
          </h1>
          <p className="text-xl md:text-2xl seenti-text-white/90 font-medium mb-8 drop-shadow-md">
            {brand?.tagline || 'Terapia Integrativa'}
          </p>
        </div>

        {/* Loading Melhorado - Progresso Visual */}
        <div className={`transition-all duration-1000 delay-500 ${loadingVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Barra de Progresso */}
          <div className="w-48 md:w-56 h-2 seenti-bg-white/20 seenti-rounded-full mx-auto mb-4 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full seenti-bg-white seenti-rounded-full transition-all duration-300 ease-out drop-shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Texto de Loading */}
          <p className="seenti-text-white/90 text-base font-medium mb-2">
            Carregando...
          </p>
          
          {/* Porcentagem */}
          <p className="seenti-text-white/70 text-sm">
            {progress}%
          </p>
        </div>

        {/* Copyright - Posicionamento Melhorado */}
        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-700 ${loadingVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="seenti-text-white/70 text-sm font-medium">
            © 2025 {brand?.poweredBy || 'Seenti®'} - Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Elementos Decorativos Sutis */}
      <div className="absolute top-10 left-10 w-20 h-20 seenti-bg-white/10 seenti-rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 seenti-bg-white/5 seenti-rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 seenti-bg-white/8 seenti-rounded-full blur-lg"></div>
    </div>
  );
}

