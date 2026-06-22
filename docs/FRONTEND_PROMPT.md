# Frontend Build Prompt — AKN CMS Admin Dashboard

Copy everything inside the prompt block below and give it to your coding agent to build the admin
dashboard UI. It encodes the AKN design system and the API contract so the result matches the
public site and talks to the backend correctly.

---

## PROMPT

````
You are building the **admin dashboard** for the AKN Real Estate CMS (أكن العقارية). It is a
content management UI where the site owner edits every section of the public marketing site.

### Non-negotiable project rules
- This is **Next.js 16 (App Router)**. It has breaking changes vs older versions. BEFORE writing
  any Next.js code, READ the relevant guide in `node_modules/next/dist/docs/` and heed deprecation
  notices. Note: middleware is `proxy.ts` in Next 16, not `middleware.ts`.
- Match the existing public site's design system EXACTLY:
  - **Tailwind CSS v4** (CSS-first config via `@theme` in globals.css — no tailwind.config.js).
  - **shadcn/ui + Radix UI** primitives. Use `cn()` from `lib/utils.ts`.
  - **Font: Cairo** (Google Fonts), loaded globally. `html { font-family: "Cairo", sans-serif; }`.
  - **Direction: RTL** (`dir="rtl"`, `direction: rtl`). Arabic-first.
  - **Border radius: 0px everywhere** ("razor-sharp" aesthetic). Only dots/avatars use full radius.
  - **Brand palette** (reuse these exact tokens):
    - primary `#5c82a6` (steel blue), primary-dark `#2c4153`, primary-light `#8eb0cc`
    - bg `#f8f9fb`, bg-card `#ffffff`, text/dark `#1a2b3c`, muted `#6b7f8e`, border `#dce3ea`
  - Icons: **@iconify/react** with the `solar:*` icon set (e.g. `solar:home-bold`), matching the site.
  - Animations: keep subtle. `framer-motion` is available but the dashboard should feel fast, not flashy.
- TypeScript strict. No `any`. Use clear types for every API entity.
- Do NOT add narration comments. Only comment non-obvious intent.

### Tech for the dashboard
- Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn/Radix.
- Data fetching/mutations: **TanStack Query** (`@tanstack/react-query`). Forms: **react-hook-form** + **zod**.
- Toaster for success/error feedback (shadcn `sonner` or `toast`).
- A typed API client wrapping `fetch` that injects the `Authorization: Bearer <accessToken>` header
  and auto-refreshes via `/auth/refresh` on 401.

### API
Base URL from `process.env.NEXT_PUBLIC_API_URL` (e.g. `http://localhost:4000/api`).
Follow the contract in `docs/ENDPOINTS.md` and the entities in `docs/SCHEMA.md`. Key points:
- Auth: `POST /auth/login` → `{ accessToken, refreshToken, user }`. Store tokens securely
  (httpOnly cookie via a route handler preferred; else memory + refresh).
- Every editable text field is **localized**: `{ ar: string; en?: string }`. Build a reusable
  `<LocalizedInput>` / `<LocalizedTextarea>` with an AR/EN tab switch; `ar` required, `en` optional.
- Singletons (Settings, Hero, About, Video, Contact, Footer): load with GET, save with PUT.
- Collections (Nav, Projects, Milestones, Values, Features, Partners): list + create + edit + delete
  + drag-to-reorder (`PATCH /:module/reorder` with `{ ids: [...] }`).
- Media Library: grid view, upload (multipart to `/admin/media`), pick-from-library dialog reused by
  every image/video field. Image fields store the returned `url`.

### Layout & screens
1. **Auth guard**: unauthenticated users are redirected to `/admin/login`. Login page = centered card,
   AKN logo, email + password, brand-styled submit button.
2. **Dashboard shell**: persistent RTL sidebar (right side) with grouped nav, top bar with site name +
   logout + "View site" link. Content area uses cards with 0px radius, `#dce3ea` borders, white surface.
   Add a `.glass-panel` style option to echo the site.
3. **Sidebar groups & pages** (one page per module):
   - General: Site Settings, Navigation
   - Home sections: Hero (+ Stats), About (+ Cards), Projects (+ media gallery), Aspirations/Milestones,
     Video Showcase, Values, Features, Partners, Contact / CTA
   - Footer: Footer info, Services, Social links
   - Library: Media
4. **Each module page**:
   - Singleton → a single form with sections; sticky Save bar showing dirty state.
   - Collection → a table/list with reorder handles, row actions (edit, delete), and an "Add" dialog/drawer form.
   - Projects → master list + detail view with an image gallery manager (upload/select, reorder, captions).
   - Every field uses the correct control: localized text, plain text (href/email/phone), number (stats),
     icon picker (iconify solar set), media picker, color (where the entity has `color`).
5. **UX details**: optimistic-friendly mutations, inline validation (zod), confirm dialogs for delete,
   toasts on save, loading skeletons, empty states, and a small live "preview" hint where helpful.

### Deliverables
- A runnable Next.js admin app (its own package) with `.env.example` (`NEXT_PUBLIC_API_URL`).
- Reusable components: `ApiClient`, `LocalizedInput`, `IconPicker`, `MediaPicker`, `ReorderableList`,
  `SingletonForm`, `CollectionTable`.
- All module pages wired to the endpoints in `docs/ENDPOINTS.md`.
- README with run instructions.

Build it now. Start by reading `node_modules/next/dist/docs/`, then scaffold the app, the design
tokens (copy from the site's `globals.css`), the API client and auth, then the module pages.
````

---

## Notes for whoever runs this prompt
- The exact `@theme` tokens and `.dark` palette live in the site repo at
  `app/[locale]/globals.css` — copy them verbatim so the dashboard and site stay visually identical.
- The `components.json` (shadcn config) and `components/ui/*` primitives in the site repo are a good
  reference for button/badge/tabs styling.
- Keep the dashboard locale-aware but Arabic-first; the editing UI itself can stay in Arabic.
