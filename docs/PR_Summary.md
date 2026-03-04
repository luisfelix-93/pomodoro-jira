# PR Summary: Correções de Autenticação e Atualização de Status de Tasks

## 📝 O que foi feito?

Este Pull Request (PR) resolve principalmente o problema crítico de falha no login com Jira OAuth na aplicação compilada/buildada, além de trazer pequenos ajustes no frontend.

### 1. Autenticação no ambiente de Produção (Electron / Github Actions)
O aplicativo de desktop (em React/Electron) estava rodando normalmente no modo desenvolvimento (*dev*), mas no momento de gerar o arquivo executável final, as variáveis do Jira (`CLIENT_ID` e `CLIENT_SECRET`) não eram encontradas pelo servidor local incluído.
- **Backend (`dotenv`)**: Adicionamos a biblioteca `dotenv` no backend e determinamos a inicialização do carregamento explicito do caminho relativo (`../.env`) em `server/src/index.ts`.
- **Electron Builder**: Modificamos a regra `extraResources` no arquivo `electron-builder.yml` para assegurar que o arquivo `server/.env` gerado acompanhe o *build* e não fique isolado fora do executável principal final.
- **Github Actions CI/CD**: A esteira de *Release* clonava o repositório mas obviamente os `.env` estavam ignorados. Agora, o `.github/workflows/release.yml` possui um passo (step) exclusivo antes da fabricação do aplicativo que usa o mecanismo de *Secrets* do GitHub (`secrets.CLIENT_ID` e `secrets.CLIENT_SECRET`) para criar "on-the-fly" um arquivo real `.env` dentro da pasta `server/` garantindo que o `build` posterior encontre o que precisa.

### 2. Aprimoramento do Menu e State Manager
- Inserimos na base de filtros (`useTaskStore`) novos status extraídos dos *workflows* do Jira (`Cancelado pelo Solicitante`, `DODM - RESOLVIDO`, `Pendente Homologação em Produção`, `[CD] Encerrado`) na *blacklist* de exibição das tarefas ativas.
- Correção de exibição da Tag do número de versão na tela de `LoginGate` para **v0.0.6**.

## 🔄 Arquivos Modificados:
- `M` `.github/workflows/release.yml` (Pipeline CI/CD atualizada)
- `M` `electron-builder.yml` (Recursos extra definidos no Webpack/Builder)
- `M` `server/package.json` & `server/package-lock.json` (Dependência do Dotenv)
- `M` `server/src/index.ts` (Import do Dotenv)
- `M` `src/pages/LoginGate.tsx` (Versão no rodapé)
- `M` `src/store/useTaskStore.ts` (Exclude status list)
