# Creators Agent POC (Frontend)

Interface de validação de vídeos para criadores de conteúdo, integrada com Agente de IA para feedback automático de _Do's_ e _Don'ts_.

## Tech Stack

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Build Tool:** Vite
- **Deploy:** Vercel

## Funcionalidades Principais

1.  **Upload de Vídeo:** Envio de arquivos `.mp4` com validação de campos obrigatórios (Briefing ID e User ID).
2.  **Feedback de Interface:**
    - Tratamento de erros de rede (ex: falha de conexão).
    - Feedback visual de "Loading" com mensagem de espera para processamentos longos.
3.  **Checklist Dinâmico (IA):**
    - **Do's:** Exibe itens obrigatórios com status visual <br>(✅ Aprovado / ⚪ Pendente).
    - **Don'ts:** Lista itens proibidos de forma limpa, sem poluição visual.
    - **Tooltips:** Detalhes da análise ("Síntese") acessíveis via hover no ícone `(i)`.
4.  **Menu OffCanvas:** Exibição dos resultados em um painel lateral deslizante, preservando o contexto do usuário.

## Como Rodar Localmente

1.  **Instale as dependências:**

    ```bash
    npm install
    ```

2.  **Configure o Backend (Proxy):**
    O projeto utiliza um Proxy no `vite.config.ts` para evitar problemas de CORS localmente.
    Certifique-se de que a API está rodando e a URL está correta no arquivo de configuração:

    ```typescript
    // vite.config.ts
    proxy: {
      '/api': {
        target: '[http://url-da-api-aqui.com](http://url-da-api-aqui.com)',
        changeOrigin: true,
        // ...
      }
    }
    ```

3.  **Rode o projeto:**
    ```bash
    npm run dev
    ```

## Estrutura de Componentes Chave

- `src/components/UploadForm.vue`: Gerencia o formulário, validação, envio para API e tratamento de erros (incluindo timeouts).
- `src/components/OffCanvas.vue`: Componente genérico de menu lateral (Slide-over) com controle de scroll do body.
- `src/components/CTooltip.vue`: Tooltip reutilizável com tema _Dark_ para exibição de metadados da IA.
- `src/App.vue`: Orquestrador principal. Gerencia o estado da aplicação (`currentAnalysis`) e a lógica de renderização das listas (Do/Don't).

## Deploy (Vercel)

Para que o Front-end funcione na Vercel (onde não temos o Proxy do Vite), utilizamos um arquivo `vercel.json` na raiz para reescrever as rotas da API:

```json
{
    "rewrites": [
        {
            "source": "/api/v1/:path*",
            "destination": "URL_REAL_DO_BACKEND/api/v1/:path*"
        }
    ]
}
```
