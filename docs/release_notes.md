# 🚀 FocusApp - Release Notes

## 🔒 Segurança e Jira OAuth PKCE (Server Proxy)
Nesta versão focamos totalmente em sanar os problemas de autorização e conexão com a Atlassian, garantindo uma autenticação extremamente estável e segura para usar o FocusApp sincronizado ao seu Jira Cloud!

### ✨ O Que Há de Novo e Melhorias
- **Login Completamente Novo via Jira:** O fluxo de autenticação OAuth 2.0 PKCE foi movido para um modelo híbrido com Proxy via Servidor Local (Node.js). Isso elimina de vez o erro frequente do tipo `401 Unauthorized` que vinha ocorrendo após dar a permissão de acesso ao App.
- **Maior Segurança no Client:** As credenciais privadas essenciais da Atlassian (`client_secret`) não trafegam mais livremente no cliente SPA, mantendo-se estritamente no ambiente Node empacotado pelo Electron.
- **Injeção de Configuração Dinâmica (Runtime Config):** Adicionada nova mecânica de configurações `config.json` ao invés de `.env` estáticos que eram amarrados na Build do app. Configurações agora são carregadas antes mesmo do React acordar!

### 🐛 Correções de Bugs (Bugfixes)
- **Correção da Rota do Callback do Login:** O problema de "congelamento de tela" que ocorria logo após fazer login na página de autenticação (na mensagem `Autenticando no Jira...`) com a tela não fechando de forma correta foi fixado. O frontend foi ensinado a escapar do `BrowserRouter` antigo e cair na sua Dashboard `/#/orbit` no react-router.
- **Correção da Pipeline do GitHub Actions do Electron:** O Banco de dados local via Prisma estava quebrando a automação do GitHub Actions porque o URL do DB (`DATABASE_URL`) era apagado no container runner do windows. O Script local do Pipeline foi atualizado garantindo o link correto na criação do release. 

---
🚀 *Feito para manter o seu foco inquebrável enquanto orquestramos as tarefas pesadas no Jira para você.*
