# PR Summary: Refatoração do Fluxo Exclusivo de Login Jira OAuth (PKCE) via Server Proxy

## 🎯 Objetivo
Resolver o erro `401 Unauthorized` constante no fluxo de login Atlassian. A solução anterior com a biblioteca cliente `react-oidc-context` falhava porque a Atlassian não é estritamente aderente ao padrão OIDC e obriga o envio do `client_secret` e cabeçalho `Content-Type: application/json` no endpoint de troca de tokens (o que é inseguro e normalmente não suportado para SPAs puros). 
Esta PR reestrutura a autenticação movendo o token exchange para o backend (Server Proxy), mantendo a segurança do `client_secret`.

## 🛠 Alterações Realizadas

### 1. Server-Side (Proxy de Autenticação)
- **Novo Endpoint de Exchange:** Adicionada e implementada a rota `POST /api/auth/exchange` no `authController.ts` e `auth.ts`.
- **Mecânica:** O frontend envia apenas o `code` de autorização; o servidor anexa em segurança o `client_secret`, define os headers corretos e efetua a troca segura com a Atlassian, repassando os tokens de volta.
- **Pipeline Segura:** Atualizado `release.yml` do GitHub Actions para incluir o `DATABASE_URL` crítico para o Prisma na compilação do backend local da Release.

### 2. Frontend (Substituição da Biblioteca Incompatível)
- **Remoção de Dependências:** O pacote incompatível `react-oidc-context` foi desinstalado e seu provider `JiraAuthProvider.tsx` foi removido completamente do `App.tsx` e deletado da codebase.
- **Novo Utilitário Leve:** Criado `src/auth/jiraAuth.ts` para assumir as responsabilidades básicas:
  - Formatação explícita da URL de autorização Atlassian (incluindo `prompt=consent` obrigatório e `audience`).
  - Função `exchangeCodeForTokens` que consome o novo proxy do backend.
- **Ajuste de Fluxo com react-router-dom:**
  - O `LoginGate.tsx` passa a chamar explicitamente o redirecionamento.
  - A rota de `CallbackPage.tsx` intercepta o `code` via `window.location.search` e chama o backend manual via fetch.
  - Corrigido um bug importante de conflito de rotas: o redirect pós-login de volta para a dashboard agora usa `window.location.replace('/#/orbit')` para sair de ambientes sem hash e engatar corretamente no `HashRouter` da aplicação base.

### 3. Configurações Dinâmicas (Runtime Config)
- Introdução de estruturas explícitas `public/config.json` e `public/config.example.json`.
- A injeção dessa configuração é forçada no arquivo raiz `main.tsx` através da rotina assíncrona do Service `runtimeConfig.ts` antes de instanciar todo o bundle do React, acabando de uma vez com as variáveis engessadas `.env` acopladas ao bundle final do Vite.

## 🧪 Como Testar
1. Subir aplicação `npm run dev`.
2. Acessar a aplicação, dar início ao login `Login with Atlassian`.
3. Validar se não ocorre mais erro na página Callback, e se cai direto carregado com sucesso na URL da dashboard `/#/orbit`.

## 📌 Checklist de Qualidade
- [x] Testado local com sucesso.
- [x] Nenhuma credencial/secret vazada pro client/bundle do Frontend.
- [x] OIDC provider dead code e pacotes lixo varridos da branch.
- [x] Pipeline CD refatorado para o DB do Electron rodar local `(DATABASE_URL)`.
