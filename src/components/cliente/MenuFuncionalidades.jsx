import React, { useState, useEffect } from 'react';
import { FaNotesMedical, FaCalendarAlt, FaHistory, FaRobot, FaUserCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function MenuFuncionalidades() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/clientes/${cliente_id}`);
        setCliente(response.data);
      } catch (err) {
        console.error('Erro ao carregar dados do cliente:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosCliente();
  }, [navigate]);

  const opcoes = [
    { 
      label: 'Nova Anamnese', 
      icon: <FaNotesMedical size={28} color="#2e7d32" />,
      action: () => navigate('/anamnese'),
      sempreAtivo: true,
      descricao: 'Preencher formulário de saúde'
    },
    { 
      label: 'Agendamentos', 
      icon: <FaCalendarAlt size={28} color="#2e7d32" />,
      action: () => navigate('/agendamentos'),
      sempreAtivo: true,
      descricao: 'Agendar e gerenciar sessões'
    },
    { 
      label: 'Histórico', 
      icon: <FaHistory size={28} color="#2e7d32" />,
      action: () => navigate('/historico'),
      sempreAtivo: true,
      descricao: 'Ver histórico de sessões'
    },
    { 
      label: 'Atendente Virtual', 
      icon: <FaRobot size={28} color="#2e7d32" />,
      action: () => alert('Atendente Virtual - Em desenvolvimento para próxima sprint'),
      sempreAtivo: false,
      descricao: 'Chat com IA (em breve)'
    },
    { 
      label: 'Configurações', 
      icon: <FaUserCog size={28} color="#2e7d32" />,
      action: () => alert('Configurações - Em desenvolvimento para próxima sprint'),
      sempreAtivo: false,
      descricao: 'Preferências (em breve)'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center my-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-6">
      <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
        Funcionalidades Disponíveis
      </h3>
      
      <nav aria-label="Menu de funcionalidades" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opcoes.map(({ label, icon, action, sempreAtivo, descricao }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            title={label}
            className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              sempreAtivo 
                ? 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 text-green-700' 
                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!sempreAtivo}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">{icon}</div>
              <div className="font-medium text-sm mb-1">{label}</div>
              <div className="text-xs opacity-75">{descricao}</div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
