# H2V Systems

Site institucional da **H2V Systems** — consultoria e desenvolvimento de software de alta performance. Construído com foco em **arquitetura robusta, performance e SEO**, totalmente internacionalizado (pt-BR, en, es).

🌐 **Produção:** [https://www.h2vsystems.com.br](https://www.h2vsystems.com.br)
👤 **Fundadora:** [Hiury Vilanova](https://hiuryvilanova.com)

---

## Stack

- **[Next.js 15](https://nextjs.org/)** com App Router e Turbopack
- **TypeScript** strict
- **Tailwind CSS** + design tokens via CSS variables
- **[Framer Motion](https://www.framer.com/motion/)** para animações e parallax
- **[next-intl](https://next-intl-docs.vercel.app/)** para i18n (pt/en/es)
- **[Resend](https://resend.com/)** para envio de e-mails
- **[Upstash Redis](https://upstash.com/)** para rate limiting persistente (opcional)
- **[Vercel Analytics](https://vercel.com/analytics)** + Speed Insights

## Recursos

### SEO
- Schemas estruturados: `Organization`, `WebSite` com `SearchAction`, `BreadcrumbList`, `Service`, `FAQPage`, `BlogPosting`
- Sitemap multi-idioma com `hreflang` alternates
- 6 landing pages dedicadas por serviço, traduzidas nos 3 idiomas
- Blog/Insights com posts em Markdown + frontmatter
- Open Graph image dinâmica (1200×630)
- Metadata completo (canonical, alternates, twitter cards)

### Performance
- Code splitting com `next/dynamic` em seções abaixo da fold
- First Load JS ≈ 102 KB compartilhado
- Imagens otimizadas (AVIF/WebP automáticos via `next/image`)
- Preload de assets críticos + DNS prefetch
- Bundle analyzer via `npm run analyze`

### Segurança
- 7 headers de segurança ativos: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control
- Rate limiting persistente em Upstash Redis (fallback em memória)
- Honeypot anti-spam no formulário de contato
- Validação server-side com escape de HTML

### Acessibilidade
- Skip to main content
- Focus visible em todos elementos interativos
- `prefers-reduced-motion` respeitado
- ARIA labels e semântica correta
- Mínimo 44×44px de touch target em mobile

### UX
- Toast notifications com animação
- Cookie banner LGPD-compliant
- PWA installable (manifest.webmanifest)
- WhatsApp float button
- Back to top, progress bar de leitura
- Dark mode-first com paleta da marca

---

## Como rodar

### Requisitos
- Node.js 20+
- npm

### Instalação

```bash
git clone https://github.com/SEU_USUARIO/H2V-Systems.git
cd H2V-Systems
npm install
```

### Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável | Obrigatória? | Descrição |
|---|---|---|
| `RESEND_API_KEY` | Não (dev) | Chave do [Resend](https://resend.com) para envio de e-mails |
| `CONTACT_TO_EMAIL` | Não | E-mail que recebe contatos do formulário |
| `CONTACT_FROM_EMAIL` | Não | Remetente exibido nos e-mails |
| `NEWSLETTER_TO_EMAIL` | Não | E-mail que recebe inscrições da newsletter |
| `UPSTASH_REDIS_REST_URL` | Não (prod) | URL do Upstash Redis para rate limit persistente |
| `UPSTASH_REDIS_REST_TOKEN` | Não (prod) | Token do Upstash Redis |

Sem `RESEND_API_KEY`, os submits do formulário são logados no console (modo dev).
Sem variáveis do Upstash, o rate limit cai para Map em memória.

### Scripts

```bash
npm run dev        # Desenvolvimento (Turbopack) em http://localhost:3000
npm run build      # Build de produção
npm run start      # Servir build de produção
npm run lint       # ESLint
npm run analyze    # Build com bundle analyzer (gera relatório visual)
```

---

## Estrutura

```
H2V-Systems/
├── content/
│   └── insights/              # Posts do blog em Markdown
├── messages/                  # Traduções (pt.json, en.json, es.json)
├── public/                    # Assets estáticos (logo, favicon)
└── src/
    ├── app/
    │   ├── [locale]/          # Rotas internacionalizadas
    │   │   ├── insights/      # Blog
    │   │   ├── servicos/      # Páginas dedicadas por serviço
    │   │   └── layout.tsx     # Layout com schemas JSON-LD
    │   ├── api/               # Routes para contato e newsletter
    │   ├── manifest.ts        # PWA manifest
    │   ├── robots.ts          # robots.txt
    │   └── sitemap.ts         # Sitemap multi-idioma
    ├── components/
    │   ├── layout/            # Navbar, Footer
    │   ├── sections/          # Hero, Services, Cases, Contact, etc
    │   └── ui/                # Toast, CookieBanner, Newsletter, etc
    ├── i18n/                  # Configuração next-intl
    ├── lib/                   # Helpers (insights, rate-limit, constants)
    └── middleware.ts          # Detecção automática de idioma
```

---

## Adicionar um novo post no blog

1. Cria `content/insights/meu-post.pt.md` com frontmatter:

```markdown
---
title: "Título do post"
description: "Descrição que aparece em listings e meta tags"
date: "2026-05-13"
author: "Hiury Vilanova"
tags: ["arquitetura", "performance"]
locale: "pt"
---

Conteúdo do post em Markdown puro.

## Subtítulo

Texto regular, **negrito**, _itálico_, [links](https://exemplo.com).
```

2. Posts em outros idiomas: `meu-post.en.md`, `meu-post.es.md`.

3. Aparecem automaticamente em `/insights` e no sitemap.

---

## Deploy

Recomendado: **[Vercel](https://vercel.com)**.

1. Conecte o repositório no painel Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push em `main`

---

## Licença

Código sob licença proprietária. © 2026 H2V Systems. Todos os direitos reservados.

Desenvolvido por [Hiury Vilanova](https://hiuryvilanova.com).
