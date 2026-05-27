# Handoff — master — 2026-05-27

## What We Were Doing

Building the Learner Passport Wizard-of-Oz demo: a Next.js web app showing 3-5 composite student profiles with AI-generated teacher briefings. Target: pitch to country head + Shillong branch head to get greenlight for a full pilot.

## Work Completed This Session

- `/office-hours` on the full PRD — produced approved design doc
- `/plan-eng-review` — full engineering review (13 decisions, 15 issues found/resolved)
- Created this project folder (`C:\Users\rohit\learner-passport`)
- Set git remote to `https://github.com/rohitsrn-hub/learner-passport.git`
- Set global git identity: `rohitsrn <rohitsrn@gmail.com>`
- Added CLAUDE.md with skill routing

## Current State

- **Repo**: initialized, 2 commits, remote set, NOT yet pushed to GitHub
- **Code**: zero — greenfield, no app code written yet
- **Design doc**: fully approved, eng-reviewed, at `C:\Users\rohit\.gstack\projects\surabhijitesh-cell-rhinodrishti\rohit-main-design-20260526-232140.md`
- **Test plan artifact**: at `C:\Users\rohit\.gstack\projects\surabhijitesh-cell-rhinodrishti\rohit-claude-funny-albattani-0c4071-eng-review-test-plan-20260527-163703.md`

## Immediately Next Steps

1. **Push to GitHub first**: `cd C:\Users\rohit\learner-passport && git push -u origin master`
2. **T1** — Bootstrap Next.js TypeScript project:
   ```
   cd C:\Users\rohit\learner-passport
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
3. **T2** — Write Zod profile schema (`src/lib/profileSchema.ts`)
   - `schema_version: z.literal('v0')`
   - `band: z.enum(['High','Medium','NeedsSupport']).nullable()`
   - `student_reflection: z.string().optional()`
4. **T3** — Write LLM provider abstraction (`src/lib/llmProvider.ts`)
   - `LLM_PROVIDER=anthropic` → `@anthropic-ai/sdk` (claude-3-5-haiku)
   - `LLM_PROVIDER=openrouter` → OpenAI SDK at `https://openrouter.ai/api/v1` (Gemini Flash 2.5)
5. **T5+T6** — Write `src/lib/outputFilter.ts` + Vitest tests (P1 safety feature)
6. See full task list in design doc Implementation Tasks section

## Key Architecture Decisions (from eng review)

| Decision | Choice |
|----------|--------|
| Stack | Next.js (TypeScript) + Tailwind |
| Deploy | Vercel free tier |
| LLM | Hybrid: live generation on click + pre-baked JSON fallback |
| LLM providers | Anthropic (claude-3-5-haiku) OR OpenRouter (Gemini Flash 2.5) via `LLM_PROVIDER` env |
| LLM call | Server-side only (`app/api/briefing/route.ts`) — key never in browser |
| Profile schema | Zod with `schema_version: z.literal('v0')` |
| Output filter | Word-boundary regex `/\bterm\b/gi` in `src/lib/outputFilter.ts` |
| Page rendering | `generateStaticParams` static generation for profile pages |
| Tests | Vitest unit tests for outputFilter.ts (11 cases minimum, P1) |

## Key Files Touched

- `C:\Users\rohit\learner-passport\CLAUDE.md` — project context + gstack skill routing
- `C:\Users\rohit\learner-passport\README.md` — placeholder
- `C:\Users\rohit\.gstack\projects\surabhijitesh-cell-rhinodrishti\rohit-main-design-20260526-232140.md` — approved design doc with eng review report + T1-T13 task list appended

## Commands to Know

```bash
# Push to GitHub (do this first)
cd C:\Users\rohit\learner-passport
git push -u origin master

# Bootstrap Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Run dev
npm run dev

# Run tests
npx vitest run

# Generate briefings (post T3+T4)
LLM_PROVIDER=anthropic npx tsx scripts/generate-briefings.ts
LLM_PROVIDER=openrouter npx tsx scripts/generate-briefings.ts

# Build static export
npm run build
```

## .env.local required vars

```
LLM_PROVIDER=anthropic          # or: openrouter
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=google/gemini-2.5-flash-preview
```

## Open Questions / Decisions Pending

1. **Day 0 IT check**: confirm with org IT whether external LLM API (Anthropic/OpenRouter) is permitted from demo environment. Hard blocker before committing to build timeline.
2. **D2 (stack)**: user dismissed the stack choice question. Next.js applied as default. Confirm this is correct at session start.
3. **Profile composites**: which 3 students to build (Arjun, Meera, Imran are named in design doc). Need 1-2 teacher inputs. Budget 5 days.
4. **Briefing API timeout**: 5s timeout before fallback — confirm this feels right during live demo.

## Optional Note from Outgoing Session

Starting fresh session in the correct project folder: `C:\Users\rohit\learner-passport` (not the rhinoDrishtiClaude folder which is a different app).
