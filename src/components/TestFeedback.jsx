import React from 'react';
import { useFeedback } from './FeedbackSystem';

const TestFeedback = () => {
  const feedback = useFeedback();

  const testSuccess = () => {
    feedback.success('✅ Teste de sucesso funcionando!');
  };

  const testError = () => {
    feedback.error('❌ Teste de erro funcionando!');
  };

  const testWarning = () => {
    feedback.warning('⚠️ Teste de aviso funcionando!');
  };

  const testInfo = () => {
    feedback.info('ℹ️ Teste de informação funcionando!');
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🧪 Teste do Sistema de Feedback</h3>
      <div className="space-y-2">
        <button
          onClick={testSuccess}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Testar Sucesso
        </button>
        <button
          onClick={testError}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Testar Erro
        </button>
        <button
          onClick={testWarning}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Testar Aviso
        </button>
        <button
          onClick={testInfo}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Testar Informação
        </button>
      </div>
    </div>
  );
};

export default TestFeedback;
