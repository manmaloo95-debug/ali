# Intelligence OS

A modular personal intelligence operating system.

## Current stack
- Idra Kernel
- Event Bus
- Execution Context
- Engine SDK
- Intent Engine
- Memory Engine
- Reality Engine
- Uncertainty Engine
- Principle Engine
- Planning Engine
- Decision Engine
- Learning Engine
- Reflection Engine

## Local development
- `npm install`
- `npm run dev`

## Verification
- `npm run typecheck`
- `npm run test:all`
- `npm run ci`
- `npm run test:api`
- `npm run test:memory`
- `npm run test:audit`
- `npm run test:kernel-audit`
- `npm run test:failover`
- `npm run test:resilience`
- `npm run test:auth`

See `docs/verification.md` for the full validation matrix.

## Vercel-ready endpoints
- `/` → static landing page
- `/health` → health check
- `/intelligence` → intelligence API
- `/memory/:userId` → memory lookup

## Project status
- GitHub: source of truth
- Vercel: deployment target
- Supabase: persistence and auth layer
