# 🌐 Documento Técnico – Aquisição e Gestão de Domínios

## 🎯 Contexto
A marca **Seenti** precisa de um domínio próprio para consolidar identidade digital e suportar o ambiente de produção.

---

## ✅ Decisão
- Domínio principal inicial: **seenti.online**  
- Possíveis futuras aquisições: **seenti.com.br**, **seenti.com**  

---

## 📋 Justificativas
- `seenti.online` está disponível e é imediato para uso.  
- `seenti.com` está em domínio especulativo (alto custo).  
- `seenti.com.br` pode ser adquirido posteriormente para uso nacional.  

---

## 🛠️ Ações Técnicas
1. Registrar **seenti.online** em provedor confiável (ex: Registro.br, GoDaddy, Namecheap).  
2. Configurar DNS apontando para:  
   - Frontend (Vercel).  
   - Backend (Render).  
3. Ativar HTTPS com certificados automáticos (Let's Encrypt/Vercel SSL).  
4. Documentar processo de aquisição e manutenção.  

---

## 🔮 Futuro
- Redirecionar automaticamente `seenti.com.br` e `seenti.com` para o domínio principal assim que forem adquiridos.  
- Centralizar gestão de DNS em um único painel administrativo.  
