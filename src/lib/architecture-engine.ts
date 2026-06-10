/**
 * Architecture recommendation engine
 *
 * Pure functions only — no React, no DOM.
 * Given user answers, returns a fully-shaped technical blueprint
 * with stack, metrics, team, timeline, risks and diagram nodes.
 */

export type ProductType = 'webapp' | 'mobile' | 'api' | 'data' | 'ecommerce' | 'realtime'
export type Scale = 'low' | 'medium' | 'high'
export type Focus = 'cost' | 'latency' | 'security'
export type Budget = 'lean' | 'growth' | 'enterprise'
export type TeamSize = 'solo' | 'small' | 'medium' | 'large'

export type Answers = {
  type:   ProductType
  scale:  Scale
  focus:  Focus
  budget: Budget
  team:   TeamSize
}

export type StackCategory =
  | 'frontend' | 'backend'  | 'database'
  | 'cache'    | 'messaging' | 'cloud'
  | 'observability' | 'cicd' | 'security'

export type StackLayer = {
  category:     StackCategory
  primary:      string
  why:          string
  alternatives: string[]
}

export type Metrics = {
  costMonthly: string
  latencyP99:  string
  rps:         string
  uptime:      string
  pattern:     string
}

export type TeamRole = {
  role:  string
  count: number
  focus: string
}

export type TimelinePhase = {
  phase: string
  weeks: number
  desc:  string
}

export type Risk = {
  title:    string
  desc:     string
  severity: 'low' | 'medium' | 'high'
}

export type DiagramNode = {
  id:    string
  label: string
  tech:  string
  layer: 'user' | 'edge' | 'app' | 'data' | 'queue' | 'obs'
}

export type DiagramEdge = {
  from:  string
  to:    string
  label?: string
}

export type Recommendation = {
  title:    string
  summary:  string
  metrics:  Metrics
  layers:   StackLayer[]
  team:     TeamRole[]
  timeline: TimelinePhase[]
  risks:    Risk[]
  diagram:  { nodes: DiagramNode[]; edges: DiagramEdge[] }
}

const TITLES: Record<ProductType, string> = {
  webapp:    'Plataforma Web Escalável',
  mobile:    'Ecossistema Mobile Cross-Platform',
  api:       'API de Alta Frequência Reativa',
  data:      'Pipeline de Dados de Alta Vazão',
  ecommerce: 'E-commerce de Alta Conversão',
  realtime:  'Sistema Realtime / Streaming',
}

const SUMMARIES: Record<ProductType, string> = {
  webapp:    'Arquitetura web stateless servida por edge, com camada de aplicação autoscaling e dados consistentes em PostgreSQL.',
  mobile:    'Backend headless via API Gateway, autenticação federada e cache distribuído para minimizar round-trips no celular.',
  api:       'API reativa pronta para picos de tráfego, com mensageria assíncrona para desacoplar consumidores.',
  data:      'Pipeline batch + stream com data lake, orquestração e camada analítica colunar para BI.',
  ecommerce: 'Storefront edge-cached, checkout consistente em SQL, fila assíncrona para pedidos e gateway PCI-isolado.',
  realtime:  'Conexões persistentes via WebSocket/MQTT, processamento de eventos em stream e estado quente em memória.',
}

const PATTERNS: Record<ProductType, string> = {
  webapp:    'Clean Architecture + SSR/ISR + CDN',
  mobile:    'BFF (Backend-for-Frontend) + CQRS leve',
  api:       'Event-Driven Architecture + Reactive Streams',
  data:      'Lambda/Kappa Architecture (batch + stream)',
  ecommerce: 'Hexagonal + Saga Pattern (orders) + CDN',
  realtime:  'Pub/Sub + Actor Model + Hot State',
}

const stack = (
  category: StackCategory,
  primary: string,
  why: string,
  alternatives: string[],
): StackLayer => ({ category, primary, why, alternatives })

function buildStack(a: Answers): StackLayer[] {
  const { type, scale, focus, budget } = a
  const serverless = focus === 'cost' || budget === 'lean'
  const enterprise = scale === 'high' || budget === 'enterprise'

  const layers: StackLayer[] = []

  // Frontend
  if (type === 'webapp' || type === 'ecommerce') {
    layers.push(stack(
      'frontend',
      'Next.js 15 (React Server Components) + TailwindCSS',
      'SSR/ISR para SEO + Edge Streaming reduzem LCP em ~40% vs SPA puro.',
      ['Remix + Cloudflare Pages', 'Astro (sites content-heavy)'],
    ))
  } else if (type === 'mobile') {
    layers.push(stack(
      'frontend',
      'React Native (New Architecture) + Expo',
      'Code-sharing entre iOS/Android e OTA updates encurtam o ciclo de release.',
      ['Flutter 3 (Skia)', 'Kotlin Multiplatform Mobile'],
    ))
  } else if (type === 'api') {
    layers.push(stack(
      'frontend',
      'OpenAPI 3.1 + Stoplight Studio (docs interativas)',
      'Contrato-first elimina drift e habilita SDK auto-gerado para clients.',
      ['GraphQL Federation (Apollo)', 'gRPC + buf.build'],
    ))
  } else if (type === 'data') {
    layers.push(stack(
      'frontend',
      'Metabase + Grafana (dashboards self-service)',
      'Reduz dependência de engenharia para análises exploratórias.',
      ['Apache Superset', 'Looker / Power BI'],
    ))
  } else {
    layers.push(stack(
      'frontend',
      'Next.js Dashboard + react-use-websocket',
      'UI reativa com reconexão automática para sinais em tempo real.',
      ['SvelteKit + Socket.io', 'Solid.js'],
    ))
  }

  // Backend
  if (type === 'data') {
    layers.push(stack(
      'backend',
      'Python (FastAPI) + Apache Airflow + dbt',
      'FastAPI para APIs analíticas; Airflow orquestra DAGs; dbt para transformações versionadas.',
      ['Dagster', 'Prefect 2', 'Mage'],
    ))
  } else if (type === 'realtime') {
    layers.push(stack(
      'backend',
      'Elixir (Phoenix Channels) ou Go (Gorilla WS)',
      'BEAM VM aguenta 2M+ conexões persistentes por nó; Go é alternativa simples com baixa latência.',
      ['Node.js + Socket.io (cluster)', 'Rust + Tokio'],
    ))
  } else if (enterprise) {
    layers.push(stack(
      'backend',
      'Kotlin + Spring Boot 3 (WebFlux reativo) + Java 21',
      'JVM moderna entrega throughput consistente; virtual threads habilitam concorrência sem reactive overhead.',
      ['Go + Fiber', 'Rust + Axum', 'Node.js + NestJS (Fastify)'],
    ))
  } else {
    layers.push(stack(
      'backend',
      'Node.js (NestJS) + TypeScript end-to-end',
      'Único runtime do front ao back reduz cognitive load e acelera time-to-market.',
      ['Bun + Hono', 'Python FastAPI', 'Kotlin + Ktor'],
    ))
  }

  // Database
  if (type === 'data') {
    layers.push(stack(
      'database',
      'ClickHouse (analytics) + S3 (data lake) + PostgreSQL (metadata)',
      'ClickHouse responde queries OLAP em sub-segundos; S3 é o storage barato para histórico.',
      ['Snowflake', 'BigQuery', 'Databricks Lakehouse'],
    ))
  } else if (type === 'realtime' || type === 'api') {
    layers.push(stack(
      'database',
      'PostgreSQL 16 + DynamoDB (hot path) + TimescaleDB',
      'Postgres como source-of-truth transacional; DynamoDB single-digit ms; TimescaleDB para séries temporais.',
      ['ScyllaDB', 'CockroachDB', 'Aurora Serverless v2'],
    ))
  } else if (type === 'ecommerce') {
    layers.push(stack(
      'database',
      'PostgreSQL 16 (transactional) + ElasticSearch (catalog)',
      'ACID para pedidos/estoque; ES para busca full-text e filtros facetados de catálogo.',
      ['MeiliSearch', 'Algolia', 'Typesense'],
    ))
  } else {
    layers.push(stack(
      'database',
      'PostgreSQL 16 (managed) + Prisma/Drizzle ORM',
      'Postgres maduro, replicação read-replica trivial e JSONB cobre 90% dos casos NoSQL.',
      ['MySQL 8 + Vitess', 'CockroachDB (multi-region)'],
    ))
  }

  // Cache
  layers.push(stack(
    'cache',
    enterprise ? 'Redis Cluster (ElastiCache)' : 'Redis (Upstash serverless)',
    enterprise
      ? 'Cluster mode horizontal scaling com replicação multi-AZ para failover automático.'
      : 'Upstash cobra por request — perfeito para tráfego irregular e MVP.',
    ['DragonflyDB', 'Memcached', 'KeyDB'],
  ))

  // Messaging (apenas quando faz sentido)
  if (type === 'api' || type === 'data' || type === 'realtime' || type === 'ecommerce' || enterprise) {
    if (type === 'data' || enterprise) {
      layers.push(stack(
        'messaging',
        'Apache Kafka (MSK) + Schema Registry',
        'Throughput de milhões msg/s, retenção configurável e schemas Avro evitam quebras de contrato.',
        ['Redpanda (Kafka API)', 'AWS Kinesis', 'Google Pub/Sub'],
      ))
    } else {
      layers.push(stack(
        'messaging',
        'AWS SQS + SNS (fan-out)',
        'Filas gerenciadas com dead-letter queue nativa; custo baixo e operação zero.',
        ['RabbitMQ', 'NATS JetStream'],
      ))
    }
  }

  // Cloud
  if (serverless) {
    layers.push(stack(
      'cloud',
      'Vercel (frontend) + AWS Lambda + DynamoDB + CloudFront',
      'Modelo pay-per-request elimina baseline; ideal para tráfego imprevisível ou abaixo de 1M req/dia.',
      ['Cloudflare Workers + D1', 'Netlify + Supabase Functions'],
    ))
  } else if (enterprise) {
    layers.push(stack(
      'cloud',
      'AWS EKS (Kubernetes) multi-AZ + RDS Aurora + CloudFront',
      'EKS dá controle fino sobre autoscaling, network policies e rollouts; Aurora separa compute/storage.',
      ['Google GKE Autopilot', 'Azure AKS', 'Bare-metal Kubernetes'],
    ))
  } else {
    layers.push(stack(
      'cloud',
      'AWS ECS Fargate + RDS + CloudFront + Route 53',
      'Containers gerenciados sem nó EC2; equilibra controle e operação simplificada.',
      ['Fly.io (deploy global)', 'Render', 'Railway'],
    ))
  }

  // Observability
  layers.push(stack(
    'observability',
    enterprise
      ? 'Datadog APM + Logs + RUM + Synthetics'
      : 'Grafana Cloud (Loki + Tempo + Mimir) ou Sentry',
    enterprise
      ? 'Suite unificada com alertas anomaly-detection e SLO tracking; reduz MTTR drasticamente.'
      : 'Stack OSS gerenciada com custo previsível; cobre logs, traces e métricas.',
    ['New Relic', 'Honeycomb (high-cardinality)', 'OpenTelemetry self-hosted'],
  ))

  // CI/CD
  layers.push(stack(
    'cicd',
    'GitHub Actions + Terraform + Argo CD (apenas se k8s)',
    'GitOps ponta-a-ponta: PR vira plan, merge vira apply; rollback é 1 revert commit.',
    ['GitLab CI', 'CircleCI', 'Buildkite'],
  ))

  // Security extra quando o foco for compliance
  if (focus === 'security') {
    layers.push(stack(
      'security',
      'AWS WAF + KMS (envelope encryption) + Vault (secrets) + SOC2 controls',
      'TLS mTLS interno, criptografia em repouso/trânsito e auditoria de acessos para LGPD/GDPR/HIPAA.',
      ['Cloudflare WAF', 'Doppler (secrets)', 'OPA / Gatekeeper'],
    ))
  }

  return layers
}

function buildMetrics(a: Answers): Metrics {
  const { type, scale, focus, budget } = a

  const costRange: Record<Budget, Record<Scale, string>> = {
    lean:       { low: '$ 60 – 180',   medium: '$ 180 – 450',   high: '$ 450 – 900'   },
    growth:     { low: '$ 350 – 800',  medium: '$ 800 – 2.500', high: '$ 2.500 – 6k'  },
    enterprise: { low: '$ 1.5k – 4k', medium: '$ 4k – 12k',     high: '$ 12k – 45k+' },
  }

  const latency =
    focus === 'latency'
      ? scale === 'high' ? '< 60 ms' : '< 90 ms'
      : type === 'data' ? '500 ms – 3 s (analytics)'
      : type === 'realtime' ? '< 50 ms'
      : scale === 'high' ? '< 180 ms' : '< 250 ms'

  const rps =
    scale === 'high' ? (type === 'api' || type === 'realtime' ? '5k – 25k req/s' : '1.5k – 5k req/s')
      : scale === 'medium' ? '300 – 1.500 req/s'
      : '20 – 300 req/s'

  const uptime =
    scale === 'high' ? '99,95% (4h/ano)' : scale === 'medium' ? '99,9% (8,7h/ano)' : '99,5% (43,8h/ano)'

  return {
    costMonthly: costRange[budget][scale],
    latencyP99:  latency,
    rps,
    uptime,
    pattern:     PATTERNS[type],
  }
}

function buildTeam(a: Answers): TeamRole[] {
  const { team, type, scale } = a

  if (team === 'solo') {
    return [
      { role: 'Full-stack Engineer',  count: 1, focus: 'Fundador codando produto + DevOps básico' },
      { role: 'Fractional Architect', count: 1, focus: 'Consultoria pontual de arquitetura (4-8h/mês)' },
    ]
  }
  if (team === 'small') {
    return [
      { role: 'Tech Lead / Architect', count: 1, focus: 'Decisões técnicas, code review, mentoria' },
      { role: 'Full-stack Engineer',   count: 2, focus: 'Features end-to-end' },
      { role: 'DevOps / SRE',          count: 1, focus: 'IaC, observabilidade, incidentes (part-time OK)' },
    ]
  }
  if (team === 'medium') {
    return [
      { role: 'Engineering Manager',    count: 1, focus: 'Roadmap, hiring, performance' },
      { role: 'Backend Engineer',       count: 3, focus: type === 'data' ? 'Pipelines, dbt, orquestração' : 'APIs, modelagem, integrações' },
      { role: 'Frontend Engineer',      count: 2, focus: 'UI, design system, performance web' },
      { role: 'DevOps / SRE',           count: 1, focus: 'Cloud, CI/CD, on-call' },
      { role: 'QA Engineer',            count: 1, focus: 'E2E, contract testing, regression suite' },
    ]
  }
  return [
    { role: 'Engineering Manager',     count: 2, focus: 'Squads autônomas, OKRs, hiring' },
    { role: 'Staff/Principal Eng.',    count: 1, focus: 'Arquitetura cross-squad, ADRs' },
    { role: 'Backend Engineers',       count: scale === 'high' ? 6 : 4, focus: 'Microsserviços, contratos, observabilidade' },
    { role: 'Frontend Engineers',      count: 3, focus: 'Design system, performance, A/B' },
    { role: 'SRE / Platform Eng.',     count: 2, focus: 'IaC, k8s, custo, segurança' },
    { role: 'Data Engineer',           count: type === 'data' ? 3 : 1, focus: 'ETL, governança, modelagem' },
    { role: 'QA / SDET',               count: 2, focus: 'Automação E2E + load test' },
    { role: 'Security Engineer',       count: 1, focus: 'AppSec, threat modeling, compliance' },
  ]
}

function buildTimeline(a: Answers): TimelinePhase[] {
  const base: TimelinePhase[] = [
    { phase: 'Discovery & ADRs',         weeks: 2, desc: 'Workshop técnico, Architectural Decision Records, modelagem de domínio.' },
    { phase: 'Infra base + CI/CD',       weeks: 2, desc: 'Provisionamento via Terraform, pipelines, ambientes dev/stg/prd.' },
    { phase: 'Core API + persistência',  weeks: 4, desc: 'Domínios principais, autenticação, banco modelado, contracts.' },
    { phase: 'Frontend MVP',             weeks: 4, desc: 'Fluxos críticos funcionais, design system base, integração com API.' },
    { phase: 'Hardening & observ.',      weeks: 2, desc: 'Load test, instrumentação OpenTelemetry, dashboards, alertas.' },
    { phase: 'Soft launch + iteração',   weeks: 2, desc: 'Beta com cohort selecionado, métricas reais, ajustes finais.' },
  ]

  if (a.type === 'data')      base[2] = { phase: 'Ingestão + DAGs Airflow',  weeks: 5, desc: 'Conectores de fontes, DAGs idempotentes, validações dbt.' }
  if (a.type === 'realtime')  base[2] = { phase: 'Gateway WebSocket + state', weeks: 5, desc: 'Conexões persistentes, sharding, replay, idempotência.' }
  if (a.scale === 'high')     base.splice(5, 0, { phase: 'Multi-região + chaos', weeks: 3, desc: 'Replicação cross-region, runbooks, game days.' })
  if (a.focus === 'security') base.splice(5, 0, { phase: 'Pen-test + auditoria', weeks: 2, desc: 'Pen-test externo, threat modeling, evidências SOC2/LGPD.' })

  return base
}

function buildRisks(a: Answers): Risk[] {
  const { type, scale, focus, budget, team } = a
  const risks: Risk[] = []

  if (scale === 'high' && team === 'solo') {
    risks.push({ title: 'Capacidade vs ambição',      severity: 'high',
      desc: 'Operar enterprise-scale com fundador solo é insustentável. Considere contratar SRE ou reduzir escopo inicial.' })
  }
  if (scale === 'high' && budget === 'lean') {
    risks.push({ title: 'Orçamento incompatível',     severity: 'high',
      desc: 'Multi-AZ + observabilidade enterprise dificilmente cabe em < US$ 500/mês. Reavalie escala ou aumente budget.' })
  }
  if (focus === 'cost' && type === 'realtime') {
    risks.push({ title: 'Realtime + serverless ≠ trivial', severity: 'medium',
      desc: 'WebSockets em Lambda têm cold-start e limites de duração. Avalie Fargate ou Fly.io para conexões persistentes.' })
  }
  if (type === 'data' && budget === 'lean') {
    risks.push({ title: 'Storage colunar tem custo fixo', severity: 'medium',
      desc: 'ClickHouse self-hosted exige operação; Snowflake/BigQuery cobram por query e podem estourar budget.' })
  }
  if (type === 'ecommerce' && focus !== 'security') {
    risks.push({ title: 'PCI-DSS é obrigatório',      severity: 'high',
      desc: 'Mesmo com gateway externo (Stripe/Pagar.me), você precisa de logs auditáveis, retenção e isolamento de rede.' })
  }
  if (focus === 'security' && team === 'solo') {
    risks.push({ title: 'Compliance solo é arriscado', severity: 'medium',
      desc: 'LGPD/GDPR exige processos contínuos (DPO, incident response). Considere consultoria especializada.' })
  }
  risks.push({ title: 'Vendor lock-in cloud',         severity: 'low',
    desc: 'Serviços managed (DynamoDB, MSK, EKS) facilitam ops, mas migração é cara. Isole adapters via hexagonal architecture.' })

  return risks
}

function buildDiagram(a: Answers): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const { type, scale, focus } = a
  const enterprise = scale === 'high'
  const useMq = type === 'api' || type === 'data' || type === 'realtime' || type === 'ecommerce' || enterprise

  const cloudFront = focus === 'cost' ? 'Cloudflare CDN' : 'CloudFront + WAF'
  const appLabel =
    type === 'data'     ? 'Airflow + dbt'
    : type === 'realtime' ? 'Phoenix / Go WS'
    : enterprise         ? 'Kotlin / Spring Boot'
    :                       'Node.js / NestJS'
  const dbLabel =
    type === 'data'     ? 'ClickHouse + S3'
    : type === 'ecommerce' ? 'Postgres + ElasticSearch'
    : 'PostgreSQL 16'
  const mqLabel =
    type === 'data' || enterprise ? 'Apache Kafka' : 'SQS + SNS'

  const nodes: DiagramNode[] = [
    { id: 'user',  layer: 'user', label: 'Cliente',         tech: 'Browser / Mobile App' },
    { id: 'edge',  layer: 'edge', label: 'Edge / CDN',      tech: cloudFront },
    { id: 'app',   layer: 'app',  label: 'Aplicação',       tech: appLabel },
    { id: 'cache', layer: 'app',  label: 'Cache',           tech: enterprise ? 'Redis Cluster' : 'Redis (Upstash)' },
    { id: 'db',    layer: 'data', label: 'Banco de Dados',  tech: dbLabel },
    { id: 'obs',   layer: 'obs',  label: 'Observabilidade', tech: enterprise ? 'Datadog' : 'Grafana Cloud' },
  ]
  if (useMq) nodes.splice(4, 0, { id: 'mq', layer: 'queue', label: 'Mensageria', tech: mqLabel })

  const edges: DiagramEdge[] = [
    { from: 'user',  to: 'edge',  label: 'HTTPS / WSS' },
    { from: 'edge',  to: 'app',   label: 'Origin' },
    { from: 'app',   to: 'cache', label: 'GET/SET' },
    { from: 'app',   to: 'db',    label: 'SQL' },
    { from: 'app',   to: 'obs',   label: 'OTLP' },
  ]
  if (useMq) {
    edges.push({ from: 'app', to: 'mq', label: 'Produce' })
    edges.push({ from: 'mq',  to: 'db', label: 'Consume' })
  }

  return { nodes, edges }
}

export function recommend(a: Answers): Recommendation {
  return {
    title:    TITLES[a.type],
    summary:  SUMMARIES[a.type],
    metrics:  buildMetrics(a),
    layers:   buildStack(a),
    team:     buildTeam(a),
    timeline: buildTimeline(a),
    risks:    buildRisks(a),
    diagram:  buildDiagram(a),
  }
}

export function recommendationToMarkdown(a: Answers, r: Recommendation): string {
  const lines: string[] = []
  lines.push(`# ${r.title}`, '', r.summary, '')
  lines.push(`> **Cenário:** ${a.type} · ${a.scale} · foco em ${a.focus} · time ${a.team} · budget ${a.budget}`, '')

  lines.push('## Métricas esperadas')
  lines.push(`- **Custo cloud:** ${r.metrics.costMonthly}`)
  lines.push(`- **Latência p99:** ${r.metrics.latencyP99}`)
  lines.push(`- **Throughput:** ${r.metrics.rps}`)
  lines.push(`- **SLA realista:** ${r.metrics.uptime}`)
  lines.push(`- **Padrão:** ${r.metrics.pattern}`, '')

  lines.push('## Stack recomendada')
  for (const l of r.layers) {
    lines.push(`### ${l.category}`)
    lines.push(`- **Escolha:** ${l.primary}`)
    lines.push(`- **Por quê:** ${l.why}`)
    lines.push(`- **Alternativas:** ${l.alternatives.join(', ')}`, '')
  }

  lines.push('## Time sugerido')
  for (const t of r.team) lines.push(`- ${t.count}× **${t.role}** — ${t.focus}`)
  lines.push('')

  lines.push('## Roadmap até o MVP')
  let totalWeeks = 0
  for (const p of r.timeline) {
    totalWeeks += p.weeks
    lines.push(`- **${p.phase}** (${p.weeks} sem.) — ${p.desc}`)
  }
  lines.push('', `**Total estimado:** ${totalWeeks} semanas (~${Math.round(totalWeeks / 4)} meses)`, '')

  lines.push('## Riscos & trade-offs')
  for (const r2 of r.risks) lines.push(`- **[${r2.severity.toUpperCase()}] ${r2.title}** — ${r2.desc}`)
  lines.push('', '---', '_Gerado pelo Simulador de Arquitetura H2V Systems — h2vsystems.com.br_')

  return lines.join('\n')
}
