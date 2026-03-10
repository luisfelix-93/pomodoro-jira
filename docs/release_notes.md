# 🚀 FocusApp - Release Notes

## v0.0.8 — Correção do Executável em Produção

### 🐛 Correções de Bugs

- **Config não encontrado no executável:** O `config.json` não era localizado ao abrir o app instalado, causando erro `ERR_FILE_NOT_FOUND`. O carregamento agora usa caminhos compatíveis com o protocolo `file://` do Electron.

- **Login OAuth não completava no executável:** Após autenticar na Atlassian, o redirect de volta para o app falhava silenciosamente porque o endereço de callback (`localhost:5173`) só existe em desenvolvimento. O Electron agora intercepta o retorno da Atlassian e processa a autenticação internamente.

- **Tela branca após login bem-sucedido:** Mesmo quando o token era trocado com sucesso, a navegação para a Dashboard falhava com `Not allowed to load local resource: file:///C:/#/orbit`. A navegação pós-login foi adaptada para funcionar corretamente tanto no modo dev quanto no executável.

### ⚙️ Detalhes Técnicos
- Interceptor `webRequest.onBeforeRequest` no processo Electron para captura do callback OAuth.
- Helper `navigateToHashRoute()` para navegação compatível com protocolos `http://` e `file://`.
- Detecção de callback dual-mode no React (`pathname` para dev, `hash` para produção).

---
🚀 *Feito para manter o seu foco inquebrável enquanto orquestramos as tarefas pesadas no Jira para você.*
