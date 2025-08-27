import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function TermoUso() {
  const [termoTexto, setTermoTexto] = useState('');
  const [erro, setErro] = useState('');
  const [aceitando, setAceitando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarTextoTermo() {
      try {
        const res = await api.get('/termos_texto');
        if (res.status === 200 && res.data.termo) {
          setTermoTexto(res.data.termo);
        } else {
          setErro('Não foi possível carregar o texto do termo.');
        }
      } catch (err) {
        console.error(err);
        setErro('Erro ao conectar com o servidor.');
      }
    }
    buscarTextoTermo();
  }, []);

  const aceitarTermo = async () => {
    setErro('');
    setAceitando(true);

    const usuario_id = localStorage.getItem('usuario_id');
    if (!usuario_id) {
      setErro('Usuário não autenticado. Faça login novamente.');
      setAceitando(false);
      navigate('/login');
      return;
    }

    if (!termoTexto) {
      setErro('O termo não foi carregado corretamente. Tente novamente.');
      setAceitando(false);
      return;
    }

    try {
      const res = await api.post('/termos_uso', {
        usuario_id,
        consentimento: true,
      });

      if (res.status === 201 || res.status === 200) {
        try {
          const clienteRes = await api.get(
            `/clientes/usuario/${usuario_id}`
          );
          if (clienteRes?.data?._id) {
            // 🔹 Salva o cliente_id no localStorage antes de redirecionar
            localStorage.setItem("cliente_id", clienteRes.data._id);
            navigate('/perfil');
          } else {
            navigate('/cadastro-cliente');
          }
        } catch (error) {
          if (error?.response?.status === 404) {
            navigate('/cadastro-cliente');
          } else {
            setErro('Erro ao verificar cadastro do cliente.');
          }
        }
      } else {
        setErro('Erro ao registrar aceite do termo.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao aceitar o termo. Verifique sua conexão.');
    } finally {
      setAceitando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 md:mt-8 p-4 md:p-8 border border-seenti-gray-200 rounded-xl shadow-lg bg-white">
      <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 seenti-text-primary text-center">
        Termo de Uso e Consentimento
      </h2>
      {erro && <p className="seenti-text-error mb-4 text-center font-medium">{erro}</p>}

      {/* Conteúdo do termo com responsividade melhorada para mobile */}
      <div className="overflow-y-auto max-h-[60vh] md:max-h-[65vh] p-4 md:p-6 border border-seenti-gray-200 bg-seenti-gray-50 rounded-lg text-sm md:text-base leading-relaxed">
        {termoTexto ? (
          <div className="prose prose-sm md:prose max-w-none">
            <div className="space-y-4 text-seenti-gray-700">
              {/* Estrutura o texto em seções para melhor legibilidade */}
              {termoTexto.split('\n\n').map((paragrafo, index) => (
                <p key={index} className="text-justify leading-relaxed">
                  {paragrafo.trim()}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center seenti-text-secondary py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-seenti-primary mx-auto mb-2"></div>
            Carregando termo...
          </div>
        )}
      </div>

      {/* Botão responsivo e melhorado para mobile */}
      <div className="mt-6 md:mt-8 flex justify-center">
        <button
          onClick={aceitarTermo}
          disabled={aceitando || !termoTexto}
          className="seenti-btn-primary w-full md:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-medium rounded-lg hover:seenti-hover-bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {aceitando ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processando...
            </span>
          ) : (
            'Aceitar e Continuar'
          )}
        </button>
      </div>
    </div>
  );
}
