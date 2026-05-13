---
title: "Microsserviços não são bala de prata: quando dividir e quando manter monolito"
description: "Microsserviços resolvem problemas de escala humana, não técnica. Veja o framework de decisão que usamos antes de quebrar uma aplicação."
date: "2026-05-08"
author: "Hiury Vilanova"
tags: ["arquitetura", "microsserviços", "engenharia"]
locale: "pt"
---

Microsserviços viraram sinônimo de "moderno" nos últimos anos. Tem reunião de tech lead onde a primeira pergunta é: "vamos quebrar em microsserviços?". E quase sempre é a pergunta errada.

## O problema real que microsserviços resolvem

Microsserviços resolvem problemas de **escala humana**, não técnica. Quando você tem 80 engenheiros pisando no mesmo repositório, releases viram pesadelo, deploy de uma feature exige coordenação entre 5 times, e qualquer mudança quebra três outras coisas. Aí faz sentido quebrar.

Quando você tem 8 engenheiros num produto que ainda está procurando product-market fit, microsserviços viram autoarmadilha: você gasta 60% do tempo lidando com infraestrutura distribuída em vez de entregar features.

## Antes de quebrar, faça isso

1. **Documente os bounded contexts.** Onde estão os limites reais do seu domínio? Você só pode quebrar onde houver fronteira clara.
2. **Avalie a maturidade da observabilidade.** Sem distributed tracing, logs centralizados e métricas por serviço, microsserviços viram caixa-preta.
3. **Considere o modulith primeiro.** Um monolito modular bem feito captura 80% do benefício de organização sem o custo operacional.

## Sinais de que vale a pena quebrar

- Times deploying em janelas conflitantes
- Tempo de build do CI ultrapassando 20 minutos
- Diferentes partes do sistema com requisitos de escala drasticamente diferentes
- Domínios de negócio realmente desacoplados

## Sinais de que NÃO vale a pena (ainda)

- Time pequeno (menos de 20 engenheiros)
- Produto pré-PMF
- Banco de dados único compartilhado
- Falta de cultura DevOps consolidada

## Conclusão

Microsserviços são uma ferramenta excelente para o problema certo. Mas a maioria das empresas que migra para microsserviços está resolvendo o problema errado, e descobre isso 18 meses depois, quando o custo de operação já dobrou.

Antes de adotar, pergunte: **qual gargalo organizacional eu estou tentando destravar?**. Se a resposta não for clara, a resposta provavelmente é "ainda não".
