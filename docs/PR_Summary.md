# Pull Request Summary: Funcionalidade de Calendário e Sincronização de Worklogs

## Resumo das Alterações
Este Pull Request foca em integrar a visualização semanal de calendário para gerenciamento dos worklogs e consertar o ciclo de vida de worklogs que falharam na primeira tentativa de sincronização (status `FAILED`). 
O usuário ganha a habilidade de arrastar e soltar (drag and drop) tickets no calendário com precisão e consegue retentar enviar apontamentos problemáticos com um simples clique.

## Detalhes Estruturais e Funcionalidades Adicionadas

### 📅 Visualização de Calendário Semanal
- Nova grade 24h implementada na interface (UI) com o scroll centralizado por padrão entre as 08:00 e 18:00 para facilitar uso no horário comercial.
- Renderização visual e responsiva dos containers arrastáveis.

### 🛠️ Interação Otimizada: Drag-and-Drop (Arrastar e Soltar)
- Permite pegar os tickets do Jira na lista e arrastá-los diretamente para uma faixa de tempo específica no calendário, criando worklogs automáticos e definidos pela dimensão dos blocos visuais.

### ♻️ Manutenção de Sincronização (Retry Status)
- O backend foi reajustado em `worklogController.ts` e nas rotas para aceitar adequadamente atualizações de itens "FAILED".
- Quando a API do Jira rejeita ou ocorre queda de rede, o worklog com erro passará a conter uma identidade visual em alerta na tela do histórico.
- Nova funcionalidade de interface do front-end que adiciona a ação manual para forçar o sistema a "Retentar" (`Retry`) sincronizar os apontamentos corrompidos.

## Pontos de Validação
- O drag-and-drop com tickets renderiza corretamente o span visual?
- Um worklog recém criado pelo evento reflete status `SYNCED` após o processo de rede?
- Disparar uma falha manual (modificando logs\_error) e garantir que a re-submissão retira a falha.
