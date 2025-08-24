# 🔐 CONFIGURAÇÃO GOOGLE OAUTH - GOOGLE CLOUD CONSOLE

## 🚨 PROBLEMA ATUAL:
**Erro 400: origin_mismatch** - Origem JavaScript não registrada

## 🔧 SOLUÇÃO: CONFIGURAR NO GOOGLE CLOUD CONSOLE

### **1. ACESSAR GOOGLE CLOUD CONSOLE:**
- **URL:** https://console.cloud.google.com/
- **Projeto:** Seenti App (ou criar novo)

### **2. CONFIGURAR CREDENCIAIS OAUTH:**

#### **2.1 APIs & Services > Credentials:**
- **Create Credentials** > **OAuth 2.0 Client IDs**
- **Application type:** Web application

#### **2.2 CONFIGURAR ORIGENS AUTORIZADAS:**
```
✅ http://localhost:3000
✅ http://localhost:5173
✅ https://frontend-seenti-app.vercel.app
✅ http://10.0.0.167:3000
✅ http://172.19.0.1:3000
```

#### **2.3 CONFIGURAR URIs DE REDIRECIONAMENTO:**
```
✅ http://localhost:3000
✅ http://localhost:3000/
✅ http://localhost:3000/login
✅ http://localhost:3000/callback
✅ https://frontend-seenti-app.vercel.app
```

### **3. VERIFICAR CLIENT ID:**
- **Client ID atual:** `768273235594-t9kch0mocin6m5gkcp984hp2f1crqii2.apps.googleusercontent.com`
- **Verificar se está correto** no Google Cloud Console

### **4. TESTAR CONFIGURAÇÃO:**
1. **Salvar** configurações no Google Cloud
2. **Aguardar** 5-10 minutos para propagação
3. **Testar** login no app local

---

## 📋 CHECKLIST DE CONFIGURAÇÃO:

- [ ] Acessar Google Cloud Console
- [ ] Configurar credenciais OAuth 2.0
- [ ] Adicionar origem: `http://localhost:3000`
- [ ] Adicionar origem: `http://localhost:5173`
- [ ] Adicionar origem: `https://frontend-seenti-app.vercel.app`
- [ ] Salvar configurações
- [ ] Aguardar propagação
- [ ] Testar login

---

## 🚀 APÓS CONFIGURAÇÃO:

1. **Reiniciar** frontend se necessário
2. **Testar** login com Google
3. **Verificar** se erro `origin_mismatch` desapareceu
4. **Confirmar** funcionalidade de autenticação

---

## 📞 SUPORTE:
- **Google Cloud Console:** https://console.cloud.google.com/
- **Documentação OAuth:** https://developers.google.com/identity/protocols/oauth2
- **Erro origin_mismatch:** https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#redirect-uri-mismatch

