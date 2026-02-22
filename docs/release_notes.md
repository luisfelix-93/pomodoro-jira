# Release Notes - v0.0.1 (Lançamento Inicial)

Bem-vindo ao primeiro lançamento do **Pomerode Jira**! 🎉

Esta versão inicial foca em entregar a fundação do aplicativo, introduzindo uma ferramenta de produtividade para desktop que integra perfeitamente a técnica Pomodoro com o rastreamento de tempo do Jira.

## 🚀 Principais Funcionalidades

- **Timer Pomodoro**: Intervalos de foco e pausas integrados para manter sua produtividade.
- **Integração com o Jira**: Autentique-se no Jira de forma segura e sincronize automaticamente seus *worklogs* (registros de trabalho) em suas *issues*.
- **Gerenciamento de Tarefas (`Task Orbit`)**: Visualize e gerencie as tarefas atribuídas a você no Jira diretamente na interface do aplicativo.
- **Modo Foco (`Focus Void`)**: Uma interface nativa livre de distrações para o cronômetro ativo, com suporte a *mini-mode*.
- **Histórico (`Log Ledger`)**: Acompanhe seus registros de trabalho através de um calendário embutido visualizando o que já foi sincronizado.
- **Anotações (`Notation Modal`)**: Adicione notas e memorandos facilmente durante a execução das tarefas, permitindo capturar o contexto de forma rápida.

## 💻 Destaques Técnicos

- **Multiplataforma**: Executáveis isolados nativos para Windows, macOS e Linux empacotados pelo Electron.
- **Interface Moderna Premium**: UI moderna adotando o estilo *Glassmorphism*, TailwindCSS e componentes com micro-animações como fundos `StarField` e botões orbitais interactivos.
- **Arquitetura Robusta**:
  - **Frontend**: React (iniciado com Vite), gerenciamento de estado via Zustand e ícones do Lucide React.
  - **Backend Local**: Servidor Node/Express acoplado com banco de dados SQLite garantindo o armazenamento local dos logs e permitindo funcionamento e cache offline.

## 🛠 Melhorias & Infraestrutura

- Pipeline e fluxo automatizado de versão e *build*.
- Scripts utilitários de desenvolvimento (`npm run dev`) que iniciam Frontend, Backend e o Electron simultaneamente.
- Configuração englobando as melhores práticas do ecossistema moderno (ESLint + Prettier).
