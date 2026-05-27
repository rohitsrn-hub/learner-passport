import { describe, it, expect } from 'vitest'
import { filterOutput } from '../outputFilter'

describe('filterOutput', () => {
  it('passes clean text through without flagging', () => {
    const r = filterOutput('Arjun shows strong analytical thinking and curiosity.')
    expect(r.flagged).toBe(false)
    expect(r.matches).toHaveLength(0)
    expect(r.sanitized).toBe('Arjun shows strong analytical thinking and curiosity.')
  })

  it('flags "disorder" standalone', () => {
    const r = filterOutput('This student has a disorder.')
    expect(r.flagged).toBe(true)
    expect(r.matches).toContain('disorder')
  })

  it('flags "ADHD" uppercase', () => {
    const r = filterOutput('May have ADHD traits.')
    expect(r.flagged).toBe(true)
    expect(r.matches.map((m) => m.toUpperCase())).toContain('ADHD')
  })

  it('flags "adhd" lowercase (case-insensitive)', () => {
    const r = filterOutput('student shows adhd-like focus issues')
    // adhd-like: 'adhd' is followed by '-', which is not a word boundary
    // so it should NOT match due to \b boundary rules
    // but 'adhd' in "adhd " would match
    const r2 = filterOutput('student shows adhd focus issues')
    expect(r2.flagged).toBe(true)
    expect(r2.matches.map((m) => m.toLowerCase())).toContain('adhd')
  })

  it('flags "disabled" mid-sentence', () => {
    const r = filterOutput('The child is disabled in several areas.')
    expect(r.flagged).toBe(true)
    expect(r.matches.map((m) => m.toLowerCase())).toContain('disabled')
  })

  it('flags multi-word phrase "problem child"', () => {
    const r = filterOutput('Teachers have called him a problem child.')
    expect(r.flagged).toBe(true)
    expect(r.matches.map((m) => m.toLowerCase())).toContain('problem child')
  })

  it('flags multi-word phrase "slow learner"', () => {
    const r = filterOutput('She is considered a slow learner by her teachers.')
    expect(r.flagged).toBe(true)
    expect(r.matches.map((m) => m.toLowerCase())).toContain('slow learner')
  })

  it('does NOT flag "slow" when part of "slowly" (word boundary)', () => {
    const r = filterOutput('Arjun slowly builds confidence in group work.')
    // "slow" inside "slowly" should not be flagged
    expect(r.flagged).toBe(false)
  })

  it('flags "remedial" as standalone', () => {
    const r = filterOutput('Enrolled in remedial classes.')
    expect(r.flagged).toBe(true)
    expect(r.matches.map((m) => m.toLowerCase())).toContain('remedial')
  })

  it('flags clinical term "dyslexia"', () => {
    const r = filterOutput('Suspected dyslexia based on reading patterns.')
    expect(r.flagged).toBe(true)
    expect(r.matches.map((m) => m.toLowerCase())).toContain('dyslexia')
  })

  it('handles empty string without error', () => {
    const r = filterOutput('')
    expect(r.flagged).toBe(false)
    expect(r.matches).toHaveLength(0)
    expect(r.sanitized).toBe('')
  })

  it('wraps flagged term in [⚠ FLAGGED] marker (phrase stays visible for teacher review)', () => {
    const r = filterOutput('She has a learning disability.')
    expect(r.flagged).toBe(true)
    // Design: highlight phrase, do not auto-suppress — teacher must edit
    expect(r.sanitized).toContain('[⚠ FLAGGED:')
    expect(r.sanitized).toContain('learning disability')
  })

  it('flags multiple banned terms in a single string', () => {
    const r = filterOutput('This disorder is related to ADHD and remedial needs.')
    expect(r.flagged).toBe(true)
    expect(r.matches.length).toBeGreaterThanOrEqual(2)
  })

  it('flags "special needs" multi-word phrase', () => {
    const r = filterOutput('Assigned to special needs category.')
    expect(r.flagged).toBe(true)
    expect(r.matches.map((m) => m.toLowerCase())).toContain('special needs')
  })
})
