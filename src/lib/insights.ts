import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

export type InsightFrontmatter = {
  title:       string
  description: string
  date:        string
  author:      string
  tags:        string[]
  readingTime: number
  locale:      string
}

export type Insight = InsightFrontmatter & {
  slug:    string
  content: string
  html:    string
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'insights')

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true })
  }
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function getAllInsightFiles(): string[] {
  ensureDir()
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
}

export function getInsightBySlug(slug: string, locale = 'pt'): Insight | null {
  ensureDir()
  const candidates = [
    `${slug}.${locale}.md`,
    `${slug}.${locale}.mdx`,
    `${slug}.md`,
    `${slug}.mdx`,
  ]
  const filename = candidates.find((c) => fs.existsSync(path.join(POSTS_DIR, c)))
  if (!filename) return null

  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8')
  const { data, content } = matter(raw)
  const fm = data as Partial<InsightFrontmatter>

  return {
    slug,
    title:       fm.title       ?? slug,
    description: fm.description ?? '',
    date:        fm.date        ?? new Date().toISOString().slice(0, 10),
    author:      fm.author      ?? 'Hiury Vilanova',
    tags:        fm.tags        ?? [],
    locale:      fm.locale      ?? locale,
    readingTime: fm.readingTime ?? estimateReadingTime(content),
    content,
    html: marked.parse(content, { async: false }) as string,
  }
}

export function getAllInsights(locale = 'pt'): Insight[] {
  const files = getAllInsightFiles()
  const slugs = new Set<string>()

  for (const f of files) {
    const base = f.replace(/\.(md|mdx)$/, '').replace(/\.(pt|en|es)$/, '')
    slugs.add(base)
  }

  return Array.from(slugs)
    .map((slug) => getInsightBySlug(slug, locale))
    .filter((p): p is Insight => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
