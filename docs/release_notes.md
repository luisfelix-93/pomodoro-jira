# Release Notes

## 🛠️ v0.0.3 (Correção do Pipeline de CI/CD para Releases)

**Data:** 22 de Fevereiro de 2026

Nesta versão, focamos em estabilizar o processo de build e release no GitHub Actions, garantindo que os artefatos do aplicativo sejam gerados e publicados corretamente na página de releases.

### 🐛 Correções de Bugs
- **Falha no Upload de Artefatos:** Corrigido um problema onde o `electron-builder` interrompia o processo e falhava a compilação por tentar realizar a publicação automática dos artefatos (ex: `.exe`, `.AppImage`, `.snap`) sem um token de acesso configurado. O processo agora ignora a publicação automática e delega corretamente para a etapa final do próprio GitHub Actions, garantindo lançamentos estáveis na nuvem.

---
