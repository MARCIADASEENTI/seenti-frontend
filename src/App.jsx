// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RouterCliente from "./components/cliente/RouterCliente";
import { getGoogleClientId } from "./config/googleOAuthConfig";
import { useGoogleSession } from "./hooks/useGoogleSession";

import SessionExpiryAlert from "./components/SessionExpiryAlert";
import FeedbackSystem from "./components/FeedbackSystem";
import "./index.css";

function AppContent() {
  const { isAuthenticated, isLoading } = useGoogleSession();


  // Mostrar loading enquanto verifica sessão
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SessionExpiryAlert />
      <BrowserRouter>
        <FeedbackSystem />
        <RouterCliente isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={getGoogleClientId()}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;
