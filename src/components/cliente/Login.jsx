// src/components/cliente/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../services/api";
import { getButtonConfig } from "../../config/googleOAuthConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [googleOAuthError, setGoogleOAuthError] = useState(false);
  const navigate = useNavigate();

  // Função para verificar fluxo do usuário
  const verificarFluxoUsuario = async (usuario_id) => {
    try {
      
      // 1. Verifica se o usuário já aceitou os termos
      const termosRes = await api.get(`/termo-assinado/${usuario_id}`);
      
      if (termosRes.data.assinado) {
        
        // 2. Se aceitou termos, verifica se tem cliente
        try {
          const clienteRes = await api.get(`/clientes/usuario/${usuario_id}`);
          
          if (clienteRes.data._id) {
            // 3. Se tem cliente, vai para perfil
            localStorage.setItem("cliente_id", clienteRes.data._id);
            navigate('/perfil');
          } else {
            // 4. Se não tem cliente, vai para cadastro de cliente
            navigate('/cadastro-cliente');
          }
        } catch (err) {
          console.error('❌ Erro ao verificar cliente:', err);
          if (err.response?.status === 404) {
            // 5. Cliente não encontrado, vai para cadastro
            navigate('/cadastro-cliente');
          } else {
            // 6. Erro na busca, vai para perfil (segurança)
            navigate('/perfil');
          }
        }
      } else {
        // 7. Se não aceitou termos, vai para página de termos
        navigate('/termo');
      }
    } catch (err) {
      console.error('❌ Erro na verificação de fluxo:', err);
      if (err.response?.status === 404) {
        // 8. Se não tem registro de termos, vai para página de termos
        navigate('/termo');
      } else {
        // 9. Em caso de erro, vai para página de termos (segurança)
        navigate('/termo');
      }
    }
  };

  // Função para lidar com o login tradicional
  const handleLogin = async () => {
    setErro("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        email,
        senha,
      });

      if (res.status === 200) {
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", email);
        localStorage.setItem("cadastro_senha", senha);
        localStorage.setItem("cadastro_tipo", res.data.tipo_usuario);
        
        // Verifica fluxo do usuário
        await verificarFluxoUsuario(res.data.usuario_id);
      }
    } catch (err) {
      console.error('❌ Erro no login:', err);
      
      // Tratamento inteligente de erros
      if (err.response?.status === 401) {
        setErro("Email ou senha incorretos.");
      } else if (err.response?.status === 404) {
        // Usuário não encontrado - sugerir cadastro
        setErro("Usuário não encontrado. Deseja criar uma conta?");
        // Limpar campos para facilitar o cadastro
        setEmail(email); // Mantém o email para facilitar
        setSenha("");
      } else if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Dados inválidos. Revise os campos.");
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Erro real de conexão
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      } else if (err.response?.status >= 500) {
        // Erro do servidor
        setErro("Erro interno do servidor. Tente novamente em alguns minutos.");
      } else {
        // Outros erros
        setErro("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o login do Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setErro("");
    setLoading(true);

    try {
      // Persistir token Google para sessão
      const googleToken = credentialResponse.credential;
      const tokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hora
      
      localStorage.setItem("google_token", googleToken);
      localStorage.setItem("google_token_expiry", tokenExpiry);
      localStorage.setItem("login_method", "google");
      
      // Envia o token do Google para o backend
      const res = await api.post('/login/google', {
        credential: googleToken
      });
      
      if (res.status === 200) {
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", res.data.email);
        localStorage.setItem("cadastro_tipo", res.data.tipo_usuario);
        
        // Verifica fluxo do usuário
        await verificarFluxoUsuario(res.data.usuario_id);
      }
    } catch (err) {
      console.error('❌ Erro no login Google:', err);
      
      // Limpar dados de sessão em caso de erro
      localStorage.removeItem("google_token");
      localStorage.removeItem("google_token_expiry");
      localStorage.removeItem("login_method");
      
      // Tratamento inteligente de erros para Google OAuth
      if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Erro na autenticação com Google.");
      } else if (err.response?.status === 404) {
        setErro("Usuário Google não encontrado. Será criado automaticamente.");
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Erro real de conexão
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      } else if (err.response?.status >= 500) {
        // Erro do servidor
        setErro("Erro interno do servidor. Tente novamente em alguns minutos.");
      } else {
        // Outros erros
        setErro("Erro na autenticação com Google. Use o login tradicional.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleOAuthError(true);
    setErro("Erro no login com Google. Use o login tradicional ou tente novamente.");
  };

  return (
    <div className="max-w-md mx-auto mt-8 md:mt-12 p-4 md:p-6 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center seenti-text-primary">
        Login
      </h2>

      {erro && (
        <div className="mb-4">
          <p className="seenti-text-error mb-3 font-medium">{erro}</p>
          
          {/* Botão inteligente para usuário não encontrado */}
          {erro.includes("Usuário não encontrado") && (
            <div className="seenti-bg-accent border border-seenti-accent/20 rounded-lg p-4">
              <p className="seenti-text-accent text-sm mb-3 font-medium">
                💡 Este email não está cadastrado em nossa base.
              </p>
              <button
                onClick={() => navigate("/cadastro-usuario", { 
                  state: { email: email } // Passa o email para facilitar o cadastro
                })}
                className="w-full seenti-btn-secondary py-3 px-4 rounded-lg hover:seenti-hover-bg-secondary-dark transition-all duration-200 text-sm font-medium"
              >
                🚀 Criar conta com este email
              </button>
            </div>
          )}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="seenti-input w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seenti-primary focus:border-transparent transition-all duration-200"
          required
        />

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          className="seenti-input w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-seenti-primary focus:border-transparent transition-all duration-200"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="seenti-btn-primary w-full h-12 text-lg font-medium rounded-lg hover:seenti-hover-bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Separador */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-seenti-gray-300"></div>
        <span className="px-4 seenti-text-secondary text-sm font-medium">ou</span>
        <div className="flex-1 border-t border-seenti-gray-300"></div>
      </div>

      {/* Botão Google Login */}
      <div className="flex justify-center">
        {!googleOAuthError ? (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            {...getButtonConfig()}
          />
        ) : (
          <div className="text-center">
            <p className="seenti-text-error mb-3 font-medium">Google OAuth indisponível</p>
            <button
              onClick={() => setGoogleOAuthError(false)}
              className="seenti-btn-secondary px-6 py-3 rounded-lg hover:seenti-hover-bg-secondary-dark transition-all duration-200 font-medium"
            >
              Tentar Google OAuth Novamente
            </button>
          </div>
        )}
      </div>

      <p className="text-center mt-6 seenti-text-secondary">
        Não possui conta?{" "}
        <button
          onClick={() => navigate("/cadastro-usuario")}
          className="seenti-text-primary underline hover:seenti-hover-text-primary-dark transition-colors duration-200 font-medium"
        >
          Criar conta
        </button>
      </p>
    </div>
  );
}
