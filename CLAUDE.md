# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # Start dev server (Turbopack, default)
pnpm build      # Production build (Turbopack, default)
pnpm start      # Start production server
```

No lint script is configured yet. To add one: `"lint": "eslint"` / `"lint:fix": "eslint --fix"` (Next.js 16 removed automatic linting from `next build`).

## Stack

- **Next.js 16.2.9** — App Router, React Server Components, Turbopack by default
- **React 19.2.4** with React Compiler (`babel-plugin-react-compiler`)
- **TypeScript 5**
- **Tailwind CSS v4** — configured via CSS `@import 'tailwindcss'`, no `tailwind.config.js`
- **shadcn** (style: `radix-mira`) — components in `src/components/ui/`, primitives from `radix-ui` (single package, not `@radix-ui/*`)
- **HugeIcons** (`@hugeicons/react`) — icon library
- **pnpm** — package manager

## Path aliases

`@/` maps to `src/`. Configured in `tsconfig.json` paths:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

## Key Next.js 16 breaking changes

**Async Request APIs (breaking):** `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are now **only async** — synchronous access is removed. Always `await` them:

```ts
// layout/page params
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}

// cookies/headers in Server Actions
const cookieStore = await cookies()
```

**No `middleware.ts`:** Use `proxy.ts` instead (renamed in v16).

**Turbopack:** Default bundler for both `next dev` and `next build`. No `--turbopack` flag needed. If you have a custom `webpack` config, builds will fail — use `next build --webpack` to opt out or migrate to `turbopack` config (top-level in `next.config`).

**Caching:** `fetch` requests are **not cached by default**. Use the `'use cache'` directive on components/functions to opt in to caching. Use `revalidatePath`, `revalidateTag`, or `refresh()` from `next/cache` after mutations.

**`next build` no longer lints** — run ESLint directly.

## Styling conventions

CSS variables are defined in `src/app/globals.css` using `oklch()` colors. The `@theme inline` block maps CSS variables to Tailwind utilities. Dark mode uses the `.dark` class (`@custom-variant dark (&:is(.dark *))`).

Use the `cn()` utility from `@/lib/utils` for conditional class merging (wraps `clsx` + `tailwind-merge`).

## shadcn components

Add components with: `pnpm dlx shadcn@latest add <component>`

The `components.json` config uses style `radix-mira`, icon library `hugeicons`, and RSC mode enabled.

Existing components: `src/components/ui/button.tsx` — uses `cva` for variants and `Slot.Root` from `radix-ui` for the `asChild` prop.

## Font

Root layout uses **Bricolage Grotesque** loaded via `next/font/google` with CSS variable `--font-bricolage-grotesque`. `--font-sans` and `--font-heading` in the theme both resolve to `--font-sans`.
