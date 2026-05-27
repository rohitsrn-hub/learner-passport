# Learner Passport

AI-powered learner profile system for central government school children (Shillong pilot).

## Project Context
- Design doc: ~/.gstack/projects/surabhijitesh-cell-rhinodrishti/rohit-main-design-20260526-232140.md
- Eng review complete. Implementation tasks T1-T13 defined.
- Stack: Next.js (TypeScript), Vercel, Zod, Vitest

## Skill routing
When the user's request matches an available skill, invoke it via the Skill tool.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
