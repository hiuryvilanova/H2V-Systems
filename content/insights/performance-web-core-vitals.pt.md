---
title: "Core Web Vitals: por que LCP, INP e CLS importam para o seu negócio"
description: "Métricas técnicas que viram dinheiro. Como o Google avalia o seu site e o que fazer para subir o ranqueamento."
date: "2026-04-20"
author: "Hiury Vilanova"
tags: ["performance", "seo", "core web vitals"]
locale: "pt"
---

Core Web Vitals deixaram de ser papo de engenheiro. São um sinal direto de ranqueamento no Google e, mais importante, têm correlação clara com taxa de conversão.

## As três métricas que importam

**LCP (Largest Contentful Paint)** mede quanto tempo demora para o maior elemento visível da página aparecer. Meta: abaixo de 2,5 segundos. Se passa de 4 segundos, o usuário tem alta probabilidade de sair.

**INP (Interaction to Next Paint)** substituiu o FID em 2024 e mede a responsividade da página a interações reais. Cliques, teclas, gestos. Meta: abaixo de 200ms.

**CLS (Cumulative Layout Shift)** mede o quanto o layout pula visualmente durante o carregamento. Aquele momento em que você vai clicar e a página se mexe, o botão muda de lugar. Meta: abaixo de 0,1.

## O que mais derruba performance

1. **Imagens sem otimização.** PNGs gigantescos quando WebP/AVIF entregam o mesmo visual com 1/3 do tamanho.
2. **JavaScript bloqueante.** Bundles grandes carregados de forma síncrona travam a renderização.
3. **Fontes sem `font-display: swap`.** Texto invisível esperando a fonte baixar.
4. **Third-party scripts.** Analytics, chat widgets, pixels de propaganda. Cada um custa 50 a 200ms.

## Plano de ação prático

- Auditoria com PageSpeed Insights e Lighthouse, focando em dados de campo (CrUX), não só lab data
- Migração de imagens para `next/image` ou equivalente com formats AVIF/WebP automáticos
- Code splitting por rota com lazy load de componentes abaixo da fold
- Preload de recursos críticos (fontes, hero image, CSS crítico inline)
- Defer de scripts não essenciais para `requestIdleCallback`

## ROI real

Estudos do Google mostram que cada melhoria de 100ms no LCP aumenta a conversão em 1%. Para um e-commerce com R$ 10M/ano em vendas, isso é R$ 100K/ano por cada 100ms ganho. Performance é dinheiro.

Não é mais negociável. É o piso da experiência digital moderna.
