import { Code2, Globe, Layers, Database, Workflow, Compass, type LucideIcon } from 'lucide-react'

export type ServiceSlug =
  | 'desenvolvimento'
  | 'web-mobile'
  | 'arquitetura'
  | 'dados'
  | 'integracoes'
  | 'consultoria'

export type ServiceMeta = {
  slug:        ServiceSlug
  icon:        LucideIcon
  stack:       string[]
  benefitsKey: 'benefits'
  faqKey:      'faq'
}

export const SERVICES: Record<ServiceSlug, ServiceMeta> = {
  'desenvolvimento': {
    slug: 'desenvolvimento',
    icon: Code2,
    stack: ['React', 'Node.js', 'TypeScript', 'Python', 'Java', 'Kotlin', 'Spring'],
    benefitsKey: 'benefits',
    faqKey: 'faq',
  },
  'web-mobile': {
    slug: 'web-mobile',
    icon: Globe,
    stack: ['Next.js', 'React Native', 'Flutter', 'PWA', 'TypeScript'],
    benefitsKey: 'benefits',
    faqKey: 'faq',
  },
  'arquitetura': {
    slug: 'arquitetura',
    icon: Layers,
    stack: ['AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Serverless', 'Cloud'],
    benefitsKey: 'benefits',
    faqKey: 'faq',
  },
  'dados': {
    slug: 'dados',
    icon: Database,
    stack: ['PostgreSQL', 'MongoDB', 'Redis', 'ETL', 'BigQuery'],
    benefitsKey: 'benefits',
    faqKey: 'faq',
  },
  'integracoes': {
    slug: 'integracoes',
    icon: Workflow,
    stack: ['REST API', 'Webhooks', 'RPA', 'n8n', 'GraphQL'],
    benefitsKey: 'benefits',
    faqKey: 'faq',
  },
  'consultoria': {
    slug: 'consultoria',
    icon: Compass,
    stack: ['Code Review', 'Tech Audit', 'Cloud', 'DevOps'],
    benefitsKey: 'benefits',
    faqKey: 'faq',
  },
}

export const SERVICE_SLUGS = Object.keys(SERVICES) as ServiceSlug[]
