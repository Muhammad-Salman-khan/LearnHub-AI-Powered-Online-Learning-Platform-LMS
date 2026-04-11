# LearnHub Full Cleanup + Performance Roadmap (`plan.md`)

## Summary
- This plan is the intended content for [plan.md](C:/Users/Zaid%20Esspl/Desktop/learnHub-ai-powered-online-learning-platform-lms/learnHub-ai-powered-online-learning-platform-lms/plan.md).
- Goal: ship a stable, clean, fast codebase with measurable loading improvements and no blocker-quality issues.
- Success criteria: route JS payload reduction of `35–55%` on key pages, dashboard/data response improvements of `30–70%`, `npm run build` passing, and lint/type baseline cleaned to production quality.

## Roadmap Milestones
1. **Milestone 0 (Week 1): Stability Baseline**
- Fix build blocker on course search params typing and runtime crash in student layout (`status` usage without `useSession` initialization).
- Fix route/path inconsistencies (`/auth/signup` vs `/signup`) and remove known dead/mock path assumptions that break real flows.
- Deliverable: stable dev/prod startup, successful build, core auth + dashboard routes navigable end-to-end.

2. **Milestone 1 (Week 1–2): Rendering Architecture Cleanup**
- Convert static-heavy pages from broad client rendering to Server Components with minimal client islands (homepage, course listing/detail, dashboard shells).
- Keep client components only for interactive pieces (forms, filters, menus, modals), move static sections server-side.
- Reduce global client overhead by scoping session/theme wrappers appropriately instead of wrapping all routes by default.
- Deliverable: lower initial hydration cost and smaller shared route chunks.

3. **Milestone 2 (Week 2): Asset and UI Performance**
- Replace remaining `<img>` usages with `next/image` where applicable, add sizes/loading/priority strategy for LCP paths.
- Replace or optimize heavy animated hero media (GIF -> optimized static/video strategy).
- Replace heavy global loading screen fallback with lightweight root fallback and route-specific detailed loaders only where needed.
- Deliverable: improved LCP/CLS, lower bandwidth usage, faster first render on public pages.

4. **Milestone 3 (Week 2–3): Data Layer and Query Optimization**
- Refactor broad `findMany` patterns to paginated/select-based responses for admin and instructor dashboards.
- Introduce typed query objects for server actions and consistent response envelopes for list APIs/actions.
- Add Prisma indexes for frequent filters/sorts in [prisma/schema.prisma](C:/Users/Zaid%20Esspl/Desktop/learnHub-ai-powered-online-learning-platform-lms/learnHub-ai-powered-online-learning-platform-lms/prisma/schema.prisma) (`isPublished`, `createdAt`, `instructorId`, `courseId + position`, etc.).
- Deliverable: reduced DB work, faster dashboard/list TTFB, scalable data fetch behavior.

5. **Milestone 4 (Week 3): Code Quality Hardening**
- Eliminate high-risk lint/type issues from [src/server/action.ts](C:/Users/Zaid%20Esspl/Desktop/learnHub-ai-powered-online-learning-platform-lms/learnHub-ai-powered-online-learning-platform-lms/src/server/action.ts), dialogs/portals, and route components.
- Remove `any` where business-critical, resolve React hook/static-component violations, and normalize async/typing patterns.
- Remove/resolve empty placeholder files and outdated duplicate component variants.
- Deliverable: clean lint baseline, safer types, clearer ownership boundaries in UI and server logic.

6. **Milestone 5 (Week 3–4): Verification and Guardrails**
- Add route-level bundle-size tracking script and baseline budgets for key routes.
- Add automated checks in CI for build/lint/type and key E2E smoke flows (auth, role redirects, dashboard access, course list/detail).
- Deliverable: continuous regression protection and measurable performance maintenance.

## Public API / Interface / Type Changes
- Change course search action signature from positional args to a typed object:
  `getSearchedCourses({ search?, category?, level?, price?, page?, pageSize? })`.
- Standardize list-returning actions to a paginated shape:
  `{ items: T[]; total: number; page: number; pageSize: number }`.
- Add explicit shared DTO types for admin/instructor table rows and course list cards to remove `any` in route-level mapping.
- Add index declarations in Prisma models and migration files for read-heavy list/filter paths.

## Test Plan and Acceptance
- Run and require passing: `npm run build`, `npm run lint`, and targeted runtime smoke checks for login/signup, role redirects, dashboard pages, and course filters.
- Verify route JS bundle reductions against baseline for `/`, `/courses`, `/dashboard/student`, `/dashboard/admin/courses`, `/dashboard/instructor/courses/[courseId]/edit`.
- Validate DB query behavior with seeded larger datasets (pagination correctness, filter correctness, sort stability, no N+1 regressions).
- Confirm UX quality: loading boundaries remain smooth, no hydration errors, and no broken navigation after server/client refactor.

## Assumptions and Defaults
- Scope selected: **Full cleanup**.
- Delivery style selected: **Roadmap milestones** (not single-sprint collapse).
- Stack stays on current Next.js App Router + Prisma architecture; no framework migration.
- Existing visual direction is preserved unless a change is required for performance/stability.
- Implementation will prioritize stability first, then performance, then broad cleanup to avoid regressions.
