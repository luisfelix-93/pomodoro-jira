# Release Notes

## 🚀 v0.0.2 (Integração OAuth 2.0 e Workflow Automático)

**Data:** 22 de Fevereiro de 2026

Nesta versão, focamos fortemente em maximizar a segurança, usabilidade de login e na agilidade dos nossos processos internos de código.

### ✨ Novidades
- **Autenticação Atlassian OAuth 2.0:** O Login que antes baseava-se na inserção manual de token de usuário (Basic Auth) foi inteiramente refeito. Agora utilizamos o fluxo seguro oficial OAuth 2.0 do Jira, unificando a experiência através do botão transparente **"Login with Atlassian"**.
- **Novo Workflow de GitHub Actions:** Criação do pipeline `create-pr` para gerar Pull Requests automaticamente ao subir uma branch nova à nuvem, reduzindo a fricção e burocracia do versionamento.
- **Estado de Sessão Modernizado:** Adaptações profundas da lógica base (`TaskOrbit` e `LoginGate`) migrada inteiramente para comunicação síncrona com o proxy e segurança orientada aos fluxos mais consolidados da internet.

---

