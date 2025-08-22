# 🚀 Guia de Deploy e Repositórios - Seenti App

## 📋 **Visão Geral**

Este documento descreve como configurar, gerenciar e fazer deploy do projeto Seenti App, incluindo a configuração de repositórios Git e automação de deploy.

## 🏗️ **Arquitetura de Deploy**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub/GitLab │    │     Vercel      │    │     Render      │
│   (Repositório) │───▶│   (Frontend)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              https://frontend-        https://backend-
         │              seenti-app.vercel.app    seenti-app.onrender.com
         ▼
   ┌─────────────────┐
   │   Desenvolvimento│
   │   Local         │
   └─────────────────┘
```

## 🔧 **Configuração Inicial**

### **1. Configurar Repositório Git**

```bash
# Executar script de configuração
chmod +x setup_git.sh
./setup_git.sh
```

**O que o script faz:**
- ✅ Inicializa repositório Git
- ✅ Configura usuário e email
- ✅ Cria branches (main, develop, staging)
- ✅ Configura hooks de pre-commit
- ✅ Configura .gitattributes
- ✅ Conecta ao repositório remoto (opcional)

### **2. Estrutura de Branches**

```
main     ← Branch de produção (deploy automático)
├── develop  ← Branch de desenvolvimento
└── staging  ← Branch de testes
```

## 🚀 **Scripts de Automação**

### **deploy.sh** - Deploy Automatizado

```bash
chmod +x deploy.sh
./deploy.sh
```

**Funcionalidades:**
- 🔄 Commit automático de mudanças
- 📤 Push para repositório remoto
- 🎨 Deploy automático para Vercel (Frontend)
- 🔧 Deploy automático para Render (Backend)
- 🏥 Verificação de saúde dos serviços
- 🧹 Limpeza de arquivos temporários

### **backup.sh** - Backup e Versionamento

```bash
chmod +x backup.sh
./backup.sh
```

**Funcionalidades:**
- 💾 Backup completo do projeto
- 🔄 Backup incremental (mudanças recentes)
- 📝 Metadados e documentação
- 🧹 Limpeza automática de backups antigos
- 🔍 Verificação de integridade

## 🌐 **Plataformas de Deploy**

### **Frontend - Vercel**

**Configuração:**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub/GitLab
3. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `SeentiCliente/Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**Deploy Automático:**
- ✅ Push para `main` → Deploy automático
- ✅ Preview automático para PRs
- ✅ Rollback automático em caso de erro

### **Backend - Render**

**Configuração:**
1. Acesse [render.com](https://render.com)
2. Conecte seu repositório GitHub/GitLab
3. Crie um **Web Service**:
   - **Name**: `seenti-backend`
   - **Root Directory**: `SeentiCliente`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

**Variáveis de Ambiente:**
```bash
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FLASK_ENV=production
```

## 📁 **Estrutura de Arquivos**

```
seenti_app/
├── .gitignore              # Arquivos ignorados pelo Git
├── .gitattributes          # Configurações de arquivos
├── VERSION.txt             # Controle de versão
├── deploy.sh               # Script de deploy
├── backup.sh               # Script de backup
├── setup_git.sh            # Configuração Git
├── start_project.sh        # Inicialização local
├── README_DEPLOY.md        # Esta documentação
├── SeentiCliente/          # Código principal
│   ├── dev/                # Backend Flask
│   ├── Frontend/           # Frontend React
│   └── requirements.txt    # Dependências Python
└── backups/                # Diretório de backups
```

## 🔄 **Fluxo de Trabalho**

### **Desenvolvimento Diário**

```bash
# 1. Fazer alterações no código
# 2. Testar localmente
./start_project.sh

# 3. Fazer commit
git add .
git commit -m "feat: nova funcionalidade"

# 4. Fazer push
git push origin develop

# 5. Criar Pull Request para main
```

### **Deploy para Produção**

```bash
# 1. Merge para main
git checkout main
git merge develop

# 2. Deploy automático
./deploy.sh

# 3. Verificar status
# - Frontend: https://frontend-seenti-app.vercel.app
# - Backend: https://backend-seenti-app.onrender.com
```

## 🛠️ **Comandos Úteis**

### **Git**

```bash
# Status do repositório
git status

# Ver branches
git branch -a

# Mudar branch
git checkout develop

# Ver histórico
git log --oneline

# Ver diferenças
git diff
```

### **Deploy e Backup**

```bash
# Deploy completo
./deploy.sh

# Backup do projeto
./backup.sh

# Verificar versão
cat VERSION.txt

# Listar backups
ls -la backups/
```

## 🔍 **Monitoramento e Logs**

### **Vercel (Frontend)**
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Logs: Dashboard do projeto → Functions → Logs
- Analytics: Dashboard do projeto → Analytics

### **Render (Backend)**
- Dashboard: [dashboard.render.com](https://dashboard.render.com)
- Logs: Serviço → Logs
- Métricas: Serviço → Metrics

## 🚨 **Solução de Problemas**

### **Deploy Falhou**

1. **Verificar logs:**
   ```bash
   # Vercel
   vercel logs

   # Render
   # Dashboard → Serviço → Logs
   ```

2. **Verificar variáveis de ambiente**
3. **Verificar dependências**
4. **Testar localmente**

### **Backup Falhou**

1. **Verificar espaço em disco:**
   ```bash
   df -h
   ```

2. **Verificar permissões:**
   ```bash
   ls -la backups/
   ```

3. **Verificar integridade:**
   ```bash
   tar -tzf backups/arquivo.tar.gz
   ```

## 📚 **Recursos Adicionais**

### **Documentação**
- [Git Documentation](https://git-scm.com/doc)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)

### **Ferramentas Recomendadas**
- **Git GUI**: GitKraken, SourceTree
- **CI/CD**: GitHub Actions, GitLab CI
- **Monitoramento**: Sentry, LogRocket

## 🎯 **Próximos Passos**

1. **Execute `./setup_git.sh`** para configurar o repositório
2. **Configure as plataformas de deploy** (Vercel + Render)
3. **Teste o deploy** com `./deploy.sh`
4. **Configure backup automático** com cron
5. **Implemente CI/CD** com GitHub Actions

---

## 📞 **Suporte**

Para dúvidas ou problemas:
1. Verifique esta documentação
2. Consulte os logs das plataformas
3. Teste localmente primeiro
4. Verifique o status dos serviços

---

**🚀 Seenti App - Deploy e Repositórios Configurados!**
