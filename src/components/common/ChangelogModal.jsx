// src/components/common/ChangelogModal.jsx
import React from 'react';
import APP_VERSION from '../../config/version';

export default function ChangelogModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📦 Changelog - v{APP_VERSION.version}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Informações da versão */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            {APP_VERSION.sprintName}
          </h3>
          <p className="text-blue-700">
            <strong>Release:</strong> {APP_VERSION.releaseDate}
          </p>
          <p className="text-blue-700">
            <strong>Status:</strong> {APP_VERSION.status}
          </p>
        </div>

        {/* Changelog */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🚀 Novidades desta versão:
          </h3>
          <ul className="space-y-2">
            {APP_VERSION.changelog.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Funcionalidades */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            ⚡ Funcionalidades principais:
          </h3>
          <ul className="space-y-2">
            {APP_VERSION.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Informações técnicas */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🔧 Stack técnico:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-gray-700">Frontend:</strong>
              <p className="text-gray-600">{APP_VERSION.technical.frontend}</p>
            </div>
            <div>
              <strong className="text-gray-700">Backend:</strong>
              <p className="text-gray-600">{APP_VERSION.technical.backend}</p>
            </div>
            <div>
              <strong className="text-gray-700">Database:</strong>
              <p className="text-gray-600">{APP_VERSION.technical.database}</p>
            </div>
            <div>
              <strong className="text-gray-700">Deployment:</strong>
              <p className="text-gray-600">{APP_VERSION.technical.deployment}</p>
            </div>
          </div>
        </div>

        {/* Suporte */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📞 Suporte:
          </h3>
          <p className="text-gray-700 mb-2">
            <strong>Desenvolvedor:</strong> {APP_VERSION.support.developer}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong> {APP_VERSION.support.email}
          </p>
          <p className="text-gray-700">
            <strong>Repositório:</strong>{' '}
            <a
              href={APP_VERSION.support.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              GitHub
            </a>
          </p>
        </div>

        {/* Botão fechar */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

