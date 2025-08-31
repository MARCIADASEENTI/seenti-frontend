// src/components/SplashScreen.jsx - Sprint 08 - Tela de Splash Profissional
// 🔄 DESATIVADO TEMPORARIAMENTE - Redirecionamento direto para login
// ✅ Mantido para implementação futura após correção dos problemas visuais

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔄 DESATIVADO: Redirecionamento imediato para login
    // ✅ Evita problemas visuais do Splash temporariamente
    console.log('🔄 Splash desativado temporariamente - redirecionando para login');
    
    // Redirecionamento imediato
    navigate("/login", { replace: true });
  }, [navigate]);

  // 🔄 Componente mantido mas não renderiza nada
  return null;
}

