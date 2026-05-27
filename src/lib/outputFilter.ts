const BANNED_TERMS = [
  'disorder',
  'disabled',
  'disability',
  'slow learner',
  'slow',
  'problem child',
  'ADHD',
  'ADD',
  'dyslexia',
  'dyslexic',
  'autism',
  'autistic',
  'bipolar',
  'depression',
  'depressed',
  'anxiety disorder',
  'OCD',
  'PTSD',
  'schizophrenia',
  'intellectual disability',
  'learning disability',
  'special needs',
  'remedial',
  'backward',
  'dull',
  'mentally',
  'retarded',
]

// Escape special regex chars then join with word boundaries.
// Multi-word phrases use flexible whitespace between words.
const escaped = BANNED_TERMS.map((t) =>
  t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
)
const FILTER_REGEX = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi')

export interface FilterResult {
  flagged: boolean
  matches: string[]
  sanitized: string
}

export function filterOutput(text: string): FilterResult {
  if (!text) return { flagged: false, matches: [], sanitized: text }

  const matches: string[] = []

  const sanitized = text.replace(FILTER_REGEX, (match) => {
    matches.push(match)
    return `[⚠ FLAGGED: "${match}"]`
  })

  return {
    flagged: matches.length > 0,
    matches,
    sanitized,
  }
}
