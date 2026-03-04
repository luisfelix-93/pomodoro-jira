# 🚀 FocusApp v0.0.6

## ✨ Novidades e Correções

### 🐛 Correções de Bugs (Backend e CI/CD)
- **Correção da Autenticação em Produção:** O fluxo de autorização do Jira via OAuth agora funciona corretamente na versão distribuída instalada (`.exe`). Antes o app falhava porque não encontrava o `CLIENT_ID` embutido durante a compilação do executável.
- **Integração de Injeção Automática (Secrets do Github):** A esteira de *release* automatizada agora constrói e embute proativamente e com segurança o seu `CLIENT_ID` e o `CLIENT_SECRET` direto das *secrets* do repositório antes de publicar um novo executável.

### 🛠️ Melhorias no Produto
- **Visualização de Tarefas Mais Limpa:** Aprimoramos a regra de filtros do Kanban, excluindo também status do Jira como `Cancelado pelo Solicitante`, `[CD] Encerrado`, `Pendente Homologação em Produção` e `DODM - RESOLVIDO`. Isso garantirá que sua barra de foco exiba somente as tarefas realmentes pendentes.
- **Versão:** Identificador de versão atualizado para `v0.0.6`.
