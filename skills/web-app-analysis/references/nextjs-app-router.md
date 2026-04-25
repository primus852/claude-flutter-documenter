# Next.js App Router — Extraction Patterns

## Route discovery

Glob: `app/**/page.{tsx,jsx,ts,js}` (exclude `app/api/**`)

Each file path maps to a route:
- `app/page.tsx` → `/`
- `app/login/page.tsx` → `/login`
- `app/(auth)/register/page.tsx` → `/register` (route group `(auth)` is stripped)
- `app/products/[id]/page.tsx` → `/products/:id` (mark as dynamic, skip in screenshots)
- `app/dashboard/(overview)/page.tsx` → `/dashboard`

## Title extraction (priority order)

1. `export const metadata = { title: "..." }` — static export at top of file
2. `<title>...</title>` in JSX
3. `<h1>...</h1>` text content (first occurrence)
4. `<h2>...</h2>` text content (if no h1)
5. Derive from path: `/forgot-password` → "Forgot Password"

## Form and field extraction

Find `<form>` elements or components that match `Form`, `*Form` naming. Within each:
- `<input name="..." />` → field name
- `<input aria-label="..." />` → field label
- `<input placeholder="..." />` → label fallback
- `<label htmlFor="...">text</label>` → preferred label (match by `id`)
- `<textarea>`, `<select>` — same pattern

## Button extraction

- `<button>text</button>`
- `<Button>text</Button>` (component)
- `<input type="submit" value="..." />`
- `<a role="button">text</a>`
- Skip: icon-only buttons with no text content, `aria-hidden="true"` buttons

## Navigation links (for journey inference)

- `<Link href="...">` — Next.js Link component
- `router.push("...")` — programmatic navigation
- `<a href="...">` — plain anchors (internal paths only, skip external URLs)

## Layout files

- `app/layout.tsx` — contains nav elements shared across all routes. Extract nav link targets.
- `app/(group)/layout.tsx` — group-level shared layout.
