# PR Summary: Correção de Bugs Críticos do Executável Electron em Produção (v0.0.8)

## 🎯 Objetivo
Resolver três bugs críticos que impediam o funcionamento do aplicativo FocusApp quando instalado via GitHub Release (executável Electron). Todos os problemas eram causados pela diferença fundamental entre o ambiente de desenvolvimento (`http://localhost:5173`) e o ambiente de produção Electron (`file://` protocol).

## 🛠 Alterações Realizadas

### 1. Correção do Carregamento do `config.json` (runtimeConfig.ts)
- **Problema:** Em produção, `fetch('/config.json')` resolvia para `file:///C:/config.json` — a raiz do drive — em vez do diretório do app.
- **Causa Raiz:** O path absoluto `/config.json` funciona no dev server HTTP, mas no protocolo `file://` o `/` aponta para a raiz do disco.
- **Correção:** Detecção dinâmica do protocolo: usa path relativo `config.json` quando `file://`, mantém absoluto `/config.json` para dev server.

### 2. Interceptação do OAuth Callback no Electron (electron/main.ts)
- **Problema:** Após login no Atlassian, o redirect para `http://localhost:5173/callback?code=...` falhava silenciosamente porque não há dev server rodando no executável buildado. O authorization code expirava sem ser trocado.
- **Causa Raiz:** O Vite dev server (porta 5173) só existe em desenvolvimento. Em produção, o frontend carrega de `file://`.
- **Correção:** Adicionado interceptor `webRequest.onBeforeRequest` no processo principal do Electron que:
  1. Captura requests para `http://localhost:5173/callback*`
  2. Cancela a navegação HTTP
  3. Extrai `code` e `state` da URL
  4. Recarrega o `index.html` local com os parâmetros OAuth no hash: `#/callback?code=...&state=...`

### 3. Adaptação do Frontend para Dual-Protocol (App.tsx + CallbackPage.tsx)
- **App.tsx:** Detecção de callback expandida para reconhecer tanto `pathname === '/callback'` (dev) quanto `hash.startsWith('#/callback?')` (Electron prod).
- **CallbackPage.tsx:**
  - Extração do `code` adaptada para ler de `window.location.search` (dev) ou `window.location.hash` (Electron prod).
  - **Correção de navegação pós-login:** `window.location.replace('/#/orbit')` resolvia para `file:///C:/#/orbit`. Substituído por helper `navigateToHashRoute()` que usa `window.location.hash` + reload no protocolo `file://`.

## 📁 Arquivos Modificados
| Arquivo | Tipo de Mudança |
|---|---|
| `src/config/runtimeConfig.ts` | Path dinâmico para config.json |
| `electron/main.ts` | Interceptor OAuth + onBeforeRequest |
| `src/App.tsx` | Detecção de callback dual-protocol |
| `src/pages/CallbackPage.tsx` | Leitura de params + navegação dual-protocol |
| `src/pages/LoginGate.tsx` | Bump de versão para v0.0.8 |
| `package.json` / `package-lock.json` | Bump de versão para v0.0.8 |

## 🧪 Como Testar
1. `npm run dev` — validar que login OAuth funciona normalmente no dev.
2. `npm run build:win` — gerar novo executável.
3. Instalar o executável e testar:
   - App abre sem erros de `config.json` no console.
   - Login via Atlassian completa com sucesso.
   - Redirect pós-login leva para a Dashboard sem erro `file:///C:/#/orbit`.

## 📌 Checklist de Qualidade
- [x] Testado em dev mode (OAuth flow completo).
- [x] Nenhuma credencial exposta no bundle do frontend.
- [x] Compatibilidade mantida entre dev (`http://`) e produção (`file://`).
- [x] Guard `useRef` contra double-exchange preservado.
