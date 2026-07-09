# Knitwise — Architecture & Implementation Plan

## Stack

- Expo + React Native
- TypeScript
- SQLite via `expo-sqlite`
- Drizzle ORM
- TanStack Query (server state)
- `useState` (ephemeral UI state)

---

## Architecture

DDD Lite + Clean Architecture. Four layers with strict dependency direction:
Domain ← Use Cases ← Infrastructure / Presentation

| Layer | Owns | Never touches |
|---|---|---|
| **Domain** | Entities, repository interfaces, calculators, business rules | DB, React, HTTP |
| **Use Cases** | Orchestration, calls to repositories, returns updated entities | Domain logic, UI state |
| **Infrastructure** | Drizzle schema, DB client, repository implementations, migrations | Business rules |
| **Presentation** | Screens, components, hooks | Business logic, DB access |

Hooks bridge TanStack Query to the use-case layer. Screens call hooks and render data — no business logic in components.

Use cases always return the updated entity after a mutation. TanStack Query updates the cache directly without a refetch.

---

## Folder Structure

```
KnitwiseApp/
├── app/                                    # Expo Router — framework-owned, thin shells only
│   ├── _layout.tsx                         # Root layout: DB init, TanStack Query provider
│   ├── (tabs)/
│   │   ├── _layout.tsx                     # Tab bar definition
│   │   ├── index.tsx                       # → ProjectListScreen
│   │   └── calculators.tsx                 # → CalculatorsScreen
│   └── project/
│       └── [id]/
│           ├── index.tsx                   # → ProjectDetailScreen
│           ├── counter/
│           │   └── [counterId].tsx         # → CounterScreen
│           └── pattern-counter/
│               └── [counterId].tsx         # → PatternCounterScreen
│
├── src/
│   ├── domain/
│   │   ├── project/
│   │   │   ├── Project.ts
│   │   │   └── IProjectRepository.ts
│   │   ├── counter/
│   │   │   ├── Counter.ts
│   │   │   ├── PatternCounter.ts
│   │   │   └── ICounterRepository.ts
│   │   ├── calculators/
│   │   │   ├── distributeIncreases.ts
│   │   │   ├── distributeDecreases.ts
│   │   │   └── types.ts
│   │   └── shared/
│   │       └── types.ts
│   │
│   ├── use-cases/
│   │   ├── project.ts
│   │   └── counter.ts
│   │
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   ├── schema.ts
│   │   │   └── migrations/
│   │   ├── repositories/
│   │   │   ├── DrizzleProjectRepository.ts
│   │   │   └── DrizzleCounterRepository.ts
│   │   └── container.ts
│   │
│   └── presentation/
│       ├── screens/
│       │   ├── ProjectListScreen.tsx
│       │   ├── ProjectDetailScreen.tsx
│       │   ├── CounterScreen.tsx
│       │   ├── PatternCounterScreen.tsx
│       │   └── CalculatorsScreen.tsx
│       ├── components/
│       │   ├── CounterDisplay.tsx
│       │   ├── PatternCounterDisplay.tsx
│       │   └── shared/
│       └── hooks/
│           ├── useProjects.ts
│           ├── useProject.ts
│           ├── useCounters.ts
│           └── useDistribution.ts
│
└── assets/
```

`tsconfig.json` path alias: `@/` → `src/`. All imports within `src/` use `@/domain/...`, `@/use-cases/...`, etc.

---

## Domain Model

### `src/domain/shared/types.ts`

```ts
type ProjectId = string
type CounterId = string
type CounterType = 'simple' | 'pattern'
```

`CounterType` is the Single Table Inheritance discriminator in the DB schema.

---

### `src/domain/project/Project.ts`

```
Project
  id:        ProjectId
  name:      string
  createdAt: Date
  updatedAt: Date
```

`updatedAt` is bumped by the repository on every `save()`.

---

### `src/domain/counter/Counter.ts`

```
Counter
  id:        CounterId
  projectId: ProjectId
  type:      CounterType     // 'simple'
  name:      string
  value:     number          // starts at 1
  createdAt: Date

  advance():   void          // value += 1
  decrement(): void          // value = Math.max(1, value - 1)
  reset():     void          // value = 1
```

Floor is 1. There is no row 0.

---

### `src/domain/counter/PatternCounter.ts`

```
PatternCounter extends Counter
  type:          CounterType    // 'pattern'
  patternLength: number         // e.g. 12

  rowInPattern():   number      // ((value - 1) % patternLength) + 1
  currentRepeat():  number      // Math.floor((value - 1) / patternLength) + 1
```

`rowInPattern` and `currentRepeat` are always derived from `value`. They are never stored.
`advance()`, `decrement()`, and `reset()` are inherited from `Counter` — no overrides needed.
There is no `totalRepeats`. The knitter decides when to stop.

---

### `src/domain/calculators/types.ts`

```
DistributionResult
  intervals:     number[]   // e.g. [5, 6, 5, 6, 5] — stitches between each change
  totalStitches: number
  changes:       number
  isEven:        boolean    // totalStitches % changes === 0
```

---

### `src/domain/calculators/distributeIncreases.ts` and `distributeDecreases.ts`

```
distributeIncreases(totalStitches: number, changes: number): DistributionResult
distributeDecreases(totalStitches: number, changes: number): DistributionResult
```

Algorithm: Bresenham-inspired. Ideal spacing = `totalStitches / changes`. Running error accumulator
determines whether each interval is `floor` or `ceil` of the ideal. Guarantees most even
distribution possible; no two adjacent intervals differ by more than 1. Both functions share the
same internal algorithm and differ only in their label.

---

### Repository Interfaces

```
IProjectRepository
  findAll():                    Promise<Project[]>
  findById(id):                 Promise<Project | null>
  save(project):                Promise<void>
  delete(id):                   Promise<void>

ICounterRepository
  findByProjectId(projectId):   Promise<Counter[]>
  findById(id):                 Promise<Counter | null>
  save(counter):                Promise<void>
  delete(id):                   Promise<void>
```

The counter repository returns `Counter | PatternCounter` — the Drizzle implementation
reconstructs the correct class based on the `type` discriminator column.

---

## Database Schema (Single Table Inheritance)

```sql
projects
  id           TEXT PRIMARY KEY
  name         TEXT NOT NULL
  created_at   INTEGER NOT NULL
  updated_at   INTEGER NOT NULL

counters
  id             TEXT PRIMARY KEY
  project_id     TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE
  type           TEXT NOT NULL        -- 'simple' | 'pattern'
  name           TEXT NOT NULL
  value          INTEGER NOT NULL DEFAULT 1
  pattern_length INTEGER              -- NULL for simple counters
  created_at     INTEGER NOT NULL
```

`PRAGMA foreign_keys = ON` must be set on every connection open. Expo SQLite does not enable it
by default. This is what enforces cascade delete when a project is deleted.

---

## Use Cases

### `src/use-cases/project.ts`

```
createProject(repo, name):          Promise<Project>
listProjects(repo):                 Promise<Project[]>
getProject(repo, id):               Promise<Project | null>
deleteProject(repo, id):            Promise<void>
```

### `src/use-cases/counter.ts`

```
createCounter(repo, projectId, name):                 Promise<Counter>
createPatternCounter(repo, projectId, name, patternLength): Promise<PatternCounter>
advanceCounter(repo, id):                             Promise<Counter | PatternCounter>
decrementCounter(repo, id):                           Promise<Counter | PatternCounter>
resetCounter(repo, id):                               Promise<Counter | PatternCounter>
deleteCounter(repo, id):                              Promise<void>
```

All mutating use cases return the updated entity so TanStack Query can update the cache directly.

---

## Infrastructure

### `src/infrastructure/db/client.ts`

Opens the Expo SQLite connection, enables `PRAGMA foreign_keys = ON`, and runs the Drizzle
migration runner on startup.

### `src/infrastructure/container.ts`

```ts
const db = openDatabase()
export const projectRepo = new DrizzleProjectRepository(db)
export const counterRepo = new DrizzleCounterRepository(db)
```

Instantiated once. Hooks import from here and pass repos into use case calls.

---

## Implementation Milestones

| # | Commit | Deliverable | Done when |
|---|---|---|---|
| 1 | `chore: scaffold folder structure and tsconfig paths` | All `src/` folders, placeholder files, `@/` alias | Project compiles, no import errors |
| 2 | `feat: database client, drizzle schema, and migrations` | DB opens on boot, schema defined, `PRAGMA foreign_keys = ON` set | App boots, DB file created on simulator |
| 3 | `feat: domain entities` | `Project`, `Counter`, `PatternCounter` with all methods | Unit tests pass for `advance`, `decrement`, `reset`, `rowInPattern`, `currentRepeat` |
| 4 | `feat: repository interfaces and drizzle implementations` | Both interfaces, both Drizzle implementations, `container.ts` | CRUD + cascade delete verified via integration test |
| 5 | `feat: use cases` | All functions in `use-cases/project.ts` and `use-cases/counter.ts` | Each use case tested against real in-memory SQLite DB |
| 6 | `feat: project list screen` | List, create, delete projects; TanStack Query wired | Full end-to-end on simulator |
| 7 | `feat: project detail screen` | Navigate to project, see counter list with empty state | Navigation works, counters scoped to project |
| 8 | `feat: simple counter screen` | `+` / `−` / reset, value display | Counter state persists across app restarts |
| 9 | `feat: pattern counter screen` | Same as counter plus repeat/row-in-pattern display | Computed values update correctly on advance and decrement |
| 10 | `feat: distribution calculators` | Algorithm + calculator screen with inputs and result | Results manually verified against known knitting examples |

---

## Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Counter hierarchy | `Counter` (concrete) + `PatternCounter extends Counter` | `Counter` is a valid standalone concept; abstract base adds indirection without benefit |
| Calculator location | `domain/calculators/` | Pure mathematical functions with no dependencies; not domain services (which coordinate entities) |
| ID type | Type aliases (`type ProjectId = string`) | Sufficient for local-only app; class-based IDs add friction with Drizzle and serialization |
| DB discriminator | Single Table Inheritance on `counters` | One table simpler than join; sparse `pattern_length` column is acceptable |
| Counter floor | 1 | No such thing as row 0 in knitting |
| Counter start value | 1 | Standard in knitting |
| `step` property | Removed | Always 1; you cannot knit two rows at a time |
| `totalRepeats` | Removed | Knitter decides when to stop; a target repeat count would need reconfiguring mid-project |
| `isComplete` | Removed | Follows from removing `totalRepeats` |
| Undo mechanism | `decrement()` method (the `−` button) | No history needed; single-step undo is sufficient |
| Mutation return value | Updated entity | TanStack Query updates cache directly without a refetch |
| Cascade delete | Enabled via `ON DELETE CASCADE` + `PRAGMA foreign_keys = ON` | Deleting a project cleans up its counters automatically |
| State management | TanStack Query for persisted data, `useState` for ephemeral UI | Clean split between server state and local UI state |
| `Counter[]` on `Project` | there shouldn't be a `counters` property on `Project` | That's the repository layer's responsibility (more on **Project Notes**)|


## Project Notes
- `counters`: `Counter[]` collection doesn't belong in the `Project` entity. The plan keeps counters as a completely separate aggregate fetched via `ICounterRepository.findByProjectId(projectId)`. `Project` shouldn't own or manage a counter collection — methods like `addCounter`, `removeCounter`, `getCounters` and the import of `Counter`, all contradict the plan's architecture. The use cases call the counter repo directly with a `projectId`; they never go through `project.addCounter()`.