// src/components/cliente/RouterCliente.jsx

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import api from '../../services/api';

// Layout White Label com alias corrigido
import WhiteLabelLayout from "@white/layouts/WhiteLabelLayout";
import PerfilClienteLayout from "../../layouts/PerfilClienteLayout";

// Componentes de fluxo do cliente
import SplashScreen from "../SplashScreen";
import Login from "./Login";
import CadastroUsuario from "./CadastroUsuario";
import TermoUso from "./TermoUso";
import CadastroCliente from "./CadastroCliente";
import BoasVindasCliente from "./BoasVindasCliente";
import PaginaCliente from "./PaginaCliente";
import AnamneseCliente from "./AnamneseCliente";
import AgendamentoCliente from "./AgendamentoCliente";
import HistoricoSessoes from "./HistoricoSessoes";
import ConfiguracoesCliente from "./ConfiguracoesCliente";
import NotificacoesCliente from "./NotificacoesCliente";
import TestFeedback from "../TestFeedback";
import SeentiThemeDemo from "../demo/SeentiThemeDemo";
import FaleComTerapeuta from "./FaleComTerapeuta";

export default function RouterCliente({ isAuthenticated }) {
  const navigate = useNavigate();

  // Redirecionar usuários já autenticados
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🚀 Usuário já autenticado, verificando fluxo...');
      
      // Verificar fluxo completo do usuário
      const verificarFluxoCompleto = async () => {
        try {
          const usuarioId = localStorage.getItem('usuario_id');
          const clienteId = localStorage.getItem('cliente_id');
          
          console.log('🔍 Verificando fluxo do usuário:', { usuarioId, clienteId });
          
          if (clienteId) {
            // ✅ Usuário tem cliente cadastrado - verificar se precisa redirecionar
            const currentPath = window.location.pathname;
            const rotasValidas = ['/perfil', '/anamnese', '/agendamentos', '/historico', '/configuracoes', '/notificacoes', '/fale-com-terapeuta'];
            
            if (!rotasValidas.includes(currentPath)) {
              // ❌ Usuário está em rota inválida - redirecionar para perfil
              console.log('❌ Usuário em rota inválida, redirecionando para perfil');
              navigate('/perfil');
            } else {
              // ✅ Usuário já está em rota válida - não redirecionar
              console.log('✅ Usuário já está em rota válida:', currentPath);
            }
          } else {
            // ❌ Usuário não tem cliente - verificar se aceitou termos
            console.log('❌ Cliente não encontrado, verificando se aceitou termos...');
            
            try {
              const res = await api.get(`/termo-assinado/${usuarioId}`);
              if (res.status === 200) {
                const data = res.data;
                
                if (data.assinado) {
                  // ✅ Aceitou termos mas não tem cliente - vai para cadastro
                  console.log('✅ Usuário aceitou termos mas não tem cliente, redirecionando para cadastro');
                  navigate('/cadastro-cliente');
                } else {
                  // ❌ Não aceitou termos - vai para termo
                  console.log('❌ Usuário não aceitou termos, redirecionando para termo');
                  navigate('/termo');
                }
              } else {
                // ❌ Erro na verificação - vai para termo (segurança)
                console.log('❌ Erro ao verificar termos, redirecionando para termo (segurança)');
                navigate('/termo');
              }
            } catch (error) {
              console.error('❌ Erro ao verificar fluxo:', error);
              // ❌ Erro na verificação - vai para termo (segurança)
              navigate('/termo');
            }
          }
        } catch (error) {
          console.error('❌ Erro na verificação de fluxo:', error);
          // ❌ Erro na verificação - vai para termo (segurança)
          navigate('/termo');
        }
      };
      
      verificarFluxoCompleto();
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      {/* Rota padrão */}
      <Route path="/" element={<Navigate to="/splash" />} />
      
      {/* Splash Screen */}
      <Route path="/splash" element={<SplashScreen />} />

      {/* Fluxo de autenticação - Usa WhiteLabelLayout */}
      <Route path="/login" element={
        <WhiteLabelLayout>
          <Login />
        </WhiteLabelLayout>
      } />
      <Route path="/cadastro-usuario" element={
        <WhiteLabelLayout>
          <CadastroUsuario />
        </WhiteLabelLayout>
      } />
      <Route path="/termo" element={
        <WhiteLabelLayout>
          <TermoUso />
        </WhiteLabelLayout>
      } />
      
      {/* Fluxo de cadastro - Usa WhiteLabelLayout */}
      <Route path="/cadastro-cliente" element={
        <WhiteLabelLayout>
          <CadastroCliente />
        </WhiteLabelLayout>
      } />
      <Route path="/boas-vindas" element={
        <WhiteLabelLayout>
          <BoasVindasCliente />
        </WhiteLabelLayout>
      } />
      
      {/* Área do cliente - Usa PerfilClienteLayout com barra lateral */}
      <Route path="/perfil" element={
        <PerfilClienteLayout>
          <PaginaCliente />
        </PerfilClienteLayout>
      } />
      <Route path="/anamnese" element={
        <PerfilClienteLayout>
          <AnamneseCliente />
        </PerfilClienteLayout>
      } />
      <Route path="/agendamentos" element={
        <PerfilClienteLayout>
          <AgendamentoCliente />
        </PerfilClienteLayout>
      } />
      <Route path="/historico" element={
        <PerfilClienteLayout>
          <HistoricoSessoes />
        </PerfilClienteLayout>
      } />
      
      {/* Sistema de Configurações */}
      <Route path="/configuracoes" element={
        <PerfilClienteLayout>
          <ConfiguracoesCliente />
        </PerfilClienteLayout>
      } />
      
      {/* Sistema de Notificações */}
      <Route path="/notificacoes" element={
        <PerfilClienteLayout>
          <NotificacoesCliente />
        </PerfilClienteLayout>
      } />
      
      {/* Hub Dinâmico - Fale Com Terapeuta */}
      <Route path="/fale-com-terapeuta" element={
        <PerfilClienteLayout>
          <FaleComTerapeuta />
        </PerfilClienteLayout>
      } />
      
      {/* Rota de teste do tema - APENAS EM DESENVOLVIMENTO */}
      {process.env.NODE_ENV === 'development' && (
        <Route path="/teste-tema" element={
          <WhiteLabelLayout>
            <SeentiThemeDemo />
          </WhiteLabelLayout>
        } />
      )}
      
      {/* Rota de teste temporária - APENAS EM DESENVOLVIMENTO */}
      {process.env.NODE_ENV === 'development' && (
        <Route path="/teste-feedback" element={
          <WhiteLabelLayout>
            <TestFeedback />
          </WhiteLabelLayout>
        } />
      )}
      
      {/* Rota legada para compatibilidade */}
      <Route path="/cliente" element={<Navigate to="/perfil" />} />

      {/* Rota fallback para páginas não encontradas */}
      <Route
        path="*"
        element={
          <WhiteLabelLayout>
            <h2 className="text-center mt-20 text-red-600">
              Página não encontrada.
            </h2>
          </WhiteLabelLayout>
        }
      />
    </Routes>
  );
}
