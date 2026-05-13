---
title: "Segurança em aplicações web: o checklist mínimo que ninguém deveria pular"
description: "Headers de segurança, CSP, rate limiting, sanitização. Os fundamentos que protegem 95% das aplicações."
date: "2026-03-15"
author: "Hiury Vilanova"
tags: ["segurança", "web", "headers"]
locale: "pt"
---

Segurança em aplicações web costuma ser tratada como problema do "depois". Depois do lançamento, depois do primeiro incidente, depois da auditoria do compliance. Quase sempre tarde demais.

A boa notícia: 95% dos ataques contra aplicações web são prevenidos com o mesmo checklist básico. Não precisa de pentest caro nem ferramenta enterprise. Precisa de disciplina.

## Headers HTTP que você deveria estar enviando

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Cada um desses headers bloqueia uma classe de ataque. HSTS força HTTPS. CSP bloqueia injeção de scripts maliciosos. X-Frame-Options impede clickjacking.

## Rate limiting em todo endpoint público

Formulário de login? Rate limit. Formulário de contato? Rate limit. API pública? Rate limit. Sem isso, qualquer script kiddie monta um ataque de brute force ou esgota suas cotas de email/SMS em horas.

Em produção, use Redis ou Upstash. Em memória só funciona em monolito não-serverless.

## Sanitização de input

Nunca confie em dado vindo do cliente. Sempre escape HTML antes de renderizar. Sempre use queries parametrizadas, nunca concatenação de strings com SQL. Validação em duas camadas: frontend (UX) e backend (segurança).

## Secrets fora do código

`.env.local` no `.gitignore`. Sempre. Use Vercel Environment Variables, AWS Secrets Manager, ou equivalente. Se já vazou, rotacione imediatamente, não tente "esconder".

## Dependências auditadas

`npm audit` no CI. Dependabot ou Renovate atualizando dependências automaticamente. Pacotes abandonados são vetor de supply chain attack.

## Conclusão

Segurança web não é mágica. É disciplina aplicada nos fundamentos. Implemente esse checklist, e você está à frente de 95% das aplicações em produção no Brasil.
