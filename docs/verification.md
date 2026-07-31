# Verification Plan

This repository now uses a layered verification strategy.

## 1. TypeScript validation
Run:

```bash
npm run typecheck
```

This checks compile-time correctness across:
- `api/`
- `lib/`
- `apps/`
- `packages/`
- `tests/`

## 2. Core unit tests
Run:

```bash
npm run test
```

Covers:
- Execution context initialization
- Event bus publish/subscribe flow
- In-memory storage behavior
- Timeout and circuit breaker primitives

## 3. AI provider failover tests
Run:

```bash
npm run test:failover
```

Covers:
- First provider success
- Failover to next provider
- Aggregated provider error reporting
- Empty provider registry behavior

## 4. Resilience tests
Run:

```bash
npm run test:resilience
```

Covers:
- `withTimeout()` success path
- `TimeoutError` on slow operations
- Circuit breaker opening at threshold
- Success clearing failure counts
- Reset window recovery

## 5. Authentication tests
Run:

```bash
npm run test:auth
```

Covers:
- Bearer token parsing
- Case-insensitive auth scheme handling
- Missing header rejection
- Wrong scheme rejection
- Empty token rejection

## 6. Persistence tests
Run:

```bash
npm run test:memory
npm run test:audit
npm run test:kernel-audit
```

Covers:
- Memory ownership isolation
- Memory lookup and search boundaries
- Audit record ordering
- Kernel audit recording behavior

## 7. API integration tests
Run:

```bash
npm run test:api
```

Covers:
- Method rejection
- Missing message validation
- Authenticated intelligence request
- Memory ownership enforcement
- User-specific memory responses

## 8. Full CI command
Run everything locally with:

```bash
npm run ci
```

This executes:
1. `npm run typecheck`
2. `npm run test:all`

The GitHub Actions workflow mirrors the same checks on every push and pull request.
