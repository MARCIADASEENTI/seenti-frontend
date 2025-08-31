import { useState, useEffect } from 'react';

/**
 * Hook personalizado para validação de anamnese
 * Sprint 09.1 - Validação obrigatória do modelo básico
 */
export const useAnamneseValidation = (form, anamneseExistente) => {
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Campos obrigatórios baseados no modelo básico (T01)
  const camposObrigatorios = [
    'objetivo',
    'dor_atual', 
    'nivel_dor',
    'aceite_termo'
  ];

  // Validação em tempo real
  const validarCampo = (nome, valor) => {
    if (anamneseExistente) return null; // Não validar se anamnese existente

    switch (nome) {
      case 'objetivo':
        if (!valor || valor.trim().length < 3) {
          return 'Objetivo deve ter pelo menos 3 caracteres';
        }
        break;
      
      case 'dor_atual':
        if (!valor || valor.trim().length < 2) {
          return 'Descreva a dor atual';
        }
        break;
      
      case 'nivel_dor':
        if (valor === null || valor === undefined || valor < 0 || valor > 10) {
          return 'Nível de dor deve ser entre 0 e 10';
        }
        break;
      
      case 'aceite_termo':
        if (!valor) {
          return 'Você deve aceitar os termos para continuar';
        }
        break;
      
      default:
        return null;
    }
    
    return null;
  };

  // Validar campo específico
  const validarCampoEspecifico = (nome, valor) => {
    const erro = validarCampo(nome, valor);
    setErrors(prev => ({
      ...prev,
      [nome]: erro
    }));
    return erro;
  };

  // Validar todos os campos
  const validarFormulario = () => {
    console.log('🔍 useAnamneseValidation: Iniciando validação do formulário...');
    console.log('🔍 useAnamneseValidation: Campos obrigatórios:', camposObrigatorios);
    console.log('🔍 useAnamneseValidation: Estado atual do form:', form);
    
    const novosErrors = {};
    
    camposObrigatorios.forEach(campo => {
      const valor = form[campo];
      console.log(`🔍 useAnamneseValidation: Validando campo '${campo}':`, valor);
      const erro = validarCampo(campo, valor);
      if (erro) {
        console.log(`❌ useAnamneseValidation: Erro no campo '${campo}':`, erro);
        novosErrors[campo] = erro;
      } else {
        console.log(`✅ useAnamneseValidation: Campo '${campo}' válido`);
      }
    });
    
    console.log('🔍 useAnamneseValidation: Erros encontrados:', novosErrors);
    console.log('🔍 useAnamneseValidation: Formulário válido:', Object.keys(novosErrors).length === 0);
    
    setErrors(novosErrors);
    return Object.keys(novosErrors).length === 0;
  };

  // Validar campo ao perder foco (onBlur)
  const handleBlur = (nome) => {
    const valor = form[nome];
    validarCampoEspecifico(nome, valor);
  };

  // Validar campo ao mudar (onChange)
  const handleChange = (nome, valor) => {
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[nome]) {
      setErrors(prev => ({
        ...prev,
        [nome]: null
      }));
    }
    
    // Validar em tempo real (opcional - pode ser removido se muito agressivo)
    // setTimeout(() => validarCampoEspecifico(nome, valor), 500);
  };

  // Verificar se formulário é válido
  useEffect(() => {
    if (anamneseExistente) {
      setIsFormValid(true);
      return;
    }

    const temErros = camposObrigatorios.some(campo => {
      const valor = form[campo];
      return validarCampo(campo, valor);
    });

    setIsFormValid(!temErros);
  }, [form, anamneseExistente, errors]);

  // Limpar erros
  const limparErros = () => {
    setErrors({});
  };

  // Obter mensagem de erro para campo específico
  const getCampoError = (nome) => {
    return errors[nome] || null;
  };

  // Verificar se campo tem erro
  const campoTemErro = (nome) => {
    return !!errors[nome];
  };

  // Verificar se campo é obrigatório
  const campoEObrigatorio = (nome) => {
    return camposObrigatorios.includes(nome);
  };

  return {
    // Estado
    errors,
    isFormValid,
    
    // Validação
    validarCampo,
    validarCampoEspecifico,
    validarFormulario,
    
    // Eventos
    handleBlur,
    handleChange,
    
    // Utilitários
    limparErros,
    getCampoError,
    campoTemErro,
    campoEObrigatorio,
    
    // Constantes
    camposObrigatorios
  };
};









