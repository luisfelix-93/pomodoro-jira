# 🚀 FocusApp - Release Notes

## v0.0.11 — Relatórios de Worklog e Correção de Mini Timer

### ✨ Novidades

- **📊 Novo Dashboard de Relatórios**: Acesse a nova rota `/reports` para visualizar seus apontamentos de worklog de forma agregada. Duas visualizações disponíveis:
  - **Relatório Diário**: Lista completa dos tickets com horas logadas no dia, total de horas e botão para copiar resumo formatado para daily meetings.
  - **Relatório Semanal**: Visão macro da semana com gráfico de barras mostrando horas por dia, breakdown por ticket e total semanal.
- **📋 Exportação para Clipboard**: Clique no botão "Copiar para Daily" para obter um texto formatado pronto para colar em suas daily meetings (formato: `- PROJ-123: 2h - Task summary`).
- **🗓️ Navegação por Datas**: Navegue facilmente entre dias e semanas com os botões de próximo/anterior ou use o seletor de data.

### 🐛 Correções de Bugs e Melhorias

- **🎯 Correção do Mini Timer**: Resolvido o bug onde o widget flutuante do timer aparecia indevidamente ao minimizar a aplicação sem nenhum timer ativo. Agora o Mini Timer só aparece quando:
  - Um Pomodoro ou timer de foco está em andamento, OU
  - Há um timer pausado com tempo acumulado.
- **⚙️ Melhorias de Estado**: Refatoração do estado inicial do timer para `IDLE`, garantindo comportamento consistente ao iniciar/fechar a aplicação.
- **📈 Otimizações de Performance**: Store de relatórios com cache inteligente e fetch otimizado de dados da API Jira.

---
