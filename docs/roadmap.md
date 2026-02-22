# Roadmap de Melhorias

Este documento concentra a visão de longo prazo e as próximas grandes *features* a serem implementadas no Pomodoro Jira, servindo como um guia (roadmap) de melhorias.

## Backlog de Funcionalidades

### 1. 🕒 Mini Timer Float (Widget)
* **Status**: Planejado
* **Documentação**: [Ver Especificação Técnica](mini-timer.specs.md)
* **Descrição**: Quando o usuário minimiza a janela principal do Pomodoro Jira e um cronômetro (ou pomodoro) está rodando, um pequeno widget flutuante (Mini Timer) é exibido sempre no topo da tela. Isso permite acompanhar o progresso sem a necessidade de manter todo o aplicativo aberto.

---

### 2. 🗓️ Refatoração do Histórico (Visão em Calendário)
* **Status**: Planejado
* **Documentação**: [Ver Especificação Técnica](history-calendar.specs.md)
* **Descrição**: Mudar a atual visualização em lista linear da tela de histórico (LogLedger) para um formato de Calendário interativo. Cada dia exibirá visualmente o "nível de esforço" (quantidade de horas registradas) permitindo clicar para expandir os logs exatos de cada dia. O objetivo é dar ao usuário uma visão macro perfeita do seu desempenho mensal.

---

### 3. 🌐 Integração Multi-Provedores (GitHub, Slack, etc.)
* **Status**: Planejado
* **Documentação**: [Ver Especificação Técnica](multi-provider.specs.md)
* **Descrição**: Evoluir de um aplicativo exclusivo "Jira" para um "Hub de Foco". Permitirá conectar outras contas como GitHub (para associar pomodoros a Issues/PRs) e Slack (para alterar o status do usuário automaticamente para "Focado" e silenciar notificações enquanto um Pomodoro estiver rodando).

---

*(Adicione novas funcionalidades aqui ao longo do tempo)*

### Ideias para o Futuro
- **Atalhos Globais (Global Shortcuts)**: Permitir pausar/iniciar ou adicionar 1 minuto extra usando combinações de teclas de qualquer lugar no sistema operacional.
- **Integração com Modos de Foco do SO**: Tentar sincronizar com o "Focus Assist" (Windows) ou "Não Perturbe" (Mac) automaticamente quando um Pomodoro inicia.
- **Relatório de Produtividade Diário**: Um resumo estético enviado por notificação ao final do dia mostrando: Pomodoros feitos vs estimativas, Tempo Total, etc.
