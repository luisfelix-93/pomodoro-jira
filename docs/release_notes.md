# 🚀 FocusApp - Release Notes

## v0.1.0 — Calendário Semanal de Worklogs & Retry de Sincronização

### ✨ Novidades
- **Nova Visualização em Calendário**: Agora é possível gerenciar todo o histórico de horas trabalhadas através de uma nova grade semanal arrastável (área util padrão centralizada de 08:00–18:00).
- **Criação de Worklog via Drag-and-Drop**: Arraste os seus tickets do Jira livremente para a tela de calendário, estabelecendo visualmente e rapidamente hora de início e duração do apontamento.

### 🐛 Correções de Bugs e Melhorias
- **Sincronização Resiliente de Worklogs (`FAILED`)**: O sistema agora cuida melhor de cenários com instabilidade de rede ou da própria API do Jira. A aplicação passará a fadar e apresentar visualmente um alerta indicando itens marcados na fila como "FAILED" nos históricos.
- **Botão de Retry Embutido**: Foi adicionado uma nova chave que oferta re-tentarem processos falhos para recuperar apontamentos perdidos através de um simples "Retry".
- **Refatorações Limpas em Controllers**: Ajustes em `worklogController.ts` integrando melhor a visualização e status de eventos com o histórico, sem impactar a fluidez visual do App.

---
