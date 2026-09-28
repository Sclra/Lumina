# Lumina — project guide for coding agents

## Working agreement

- Lumina (The Lumina Residences / مجتمع لومینا) is a bilingual residential building management application with resident and manager experiences.
- Fix the functionality the user requests with the smallest complete change. Trace shared dependencies first and preserve unrelated behavior, data, navigation, and visual design.
- Every functional fix must work in **English (`en`, LTR) and Persian (`fa`, RTL)**. Include labels, validation, success/error states, dates, numbers, input behavior, and layout in the scope of the fix.
- Do not turn a targeted fix into a redesign, broad refactor, dependency upgrade, or implementation of unrelated unfinished features.
- For a read-only review or documentation request, change only the requested documentation. Findings below are context, not authorization to fix them.
- Read relevant files before editing; use `rg` to find consumers of changed types, helpers, translation keys, and state. Check the existing working tree and preserve the user's changes.
- Explain outcomes and verification concisely in the user's language. Distinguish source inspection from behavior actually tested in a browser.

## Product and implementation status

Residents can navigate home, apartment and utility statements, common-area booking, building news, news submissions, and settings. Managers can configure a property, create units and charges, manage announcements, review submissions, and manage staff.

The repository currently implements an interactive frontend prototype. There is no application backend, database, real authentication, payment gateway integration, email delivery, or push service in the checked-in application code. Some screens use shared React state; others use independent sample data or local component state. UI copy describing an operation does not prove an external operation exists.

`src/imports/pasted_text/resident-app-brief.md` is the historical resident MVP brief and design reference. It predates manager functionality and other additions. Preserve both existing roles; do not remove manager features to match the older resident-only scope. Use current code and the user's current requirements as the implementation context. Two reference screenshots also live in `src/imports/`.

## Runtime and development

- React 19, React DOM 19, TypeScript with strict checking, Vite 8, Tailwind CSS v4, and oxfmt.
- Runtime dependencies are only React and React DOM. Routing, localization, icons, and state management are local implementations; no router, i18n library, UI framework, or external store is installed.
- `.mise.toml` specifies Node 22 and pnpm 10.34.3. Use pnpm and preserve `pnpm-lock.yaml`.
- In Figma Make, Vite is already running on `$PORT` (default `8443`). Use the preview panel and hot reload; do not start a duplicate server.
- `pnpm build` runs `vite build`. It builds the bundle but does not replace TypeScript checking.
- `pnpm exec tsc --noEmit` checks the TypeScript project separately.
- `pnpm format` invokes oxfmt. Avoid formatting unrelated files during a targeted fix.
- There is currently no test runner, test script, or lint script in `package.json`. Do not claim nonexistent checks ran.
- `vite.config.ts` provides React/Tailwind plugins, Figma integration, the `@` alias for `src`, and the `FIGMA_PUBLIC_URL` base path. Keep platform configuration intact unless the task concerns it.
- `.figma/make/` contains installation, development, formatting, and deployment scripts; `.figma/make/site.json` supplies site metadata. Reading these does not require running deployment.
- `Dockerfile` builds with Node/pnpm and serves `dist/` with Nginx. `nginx.conf` includes SPA fallback and separate service-worker/manifest caching rules.

## Source map

Start with task-relevant files here and follow their imports and consumers as needed.

| Area | Files and responsibility |
| --- | --- |
| Entry and shell | `src/main.tsx`: global CSS, StrictMode mount, installed-app detection, service-worker registration. `src/App.tsx`: providers, screen state, navigation history, route parameters, tab visibility. `index.html`: document shell and PWA metadata. |
| Shared state | `src/managerStore.tsx`: current display identity, property, units, charges, announcements, staff, submissions, mutations, and domain types. `src/profile.ts`: shared localized profile labels and initials. |
| Language | `src/lang.tsx`: language context and persistence. `src/translations.ts`: English/Persian dictionaries. |
| Styling | `src/theme.tsx`: light/dark tokens and theme context. `src/index.css`: Tailwind, font, viewport, phone frame, safe areas, and scrolling. |
| Navigation/input | `src/components/BottomNav.tsx`, `src/components/ManagerNav.tsx`, `src/components/TimeWheel.tsx`. |
| Sign-in/home | `src/screens/SignIn.tsx`, `src/screens/Home.tsx`. |
| Resident payments | `src/screens/Payments.tsx`, `src/screens/PaymentDetail.tsx`, `src/screens/MonthlyDetail.tsx`. |
| Reservations | `src/screens/Reservations.tsx`, `src/screens/ReservationBooking.tsx`, plus `TimeWheel.tsx`. |
| Resident news | `src/screens/News.tsx`, `src/screens/NewsDetail.tsx`, `src/screens/NewsCreate.tsx`, `src/data/newsData.ts`, `src/data/newsDataFa.ts`, `src/data/usePublishedNews.ts`. |
| Shared settings | `Settings.tsx`, `Accounts.tsx`, `Preferences.tsx`, `LanguageSettings.tsx`, `NotificationsSettings.tsx`, `FAQ.tsx`, `Feedback.tsx`, all under `src/screens/`. |
| Manager setup/overview | `ManagerSetup.tsx`, `ManagerDashboard.tsx`, under `src/screens/manager/`. |
| Manager units | `ManagerUnits.tsx`, `ManagerUnitNew.tsx`, `ManagerUnitDetail.tsx`, under `src/screens/manager/`. |
| Manager charges | `ManagerBilling.tsx`, `ManagerChargeNew.tsx`, under `src/screens/manager/`. |
| Manager communications | `ManagerNews.tsx`, `ManagerNewsNew.tsx`, under `src/screens/manager/`. |
| Manager staff | `ManagerTeam.tsx`, `ManagerStaffNew.tsx`, under `src/screens/manager/`. |
| Manager UI helpers | `src/screens/manager/mui.tsx`: local header, field, input style, card, button, status pill, and toggle helpers; this is not Material UI. |
| Public assets/PWA | `public/manifest.webmanifest`, `public/sw.js`, `public/icons/`, `public/images/guest-parking.jpg`. |

## Navigation and role boundaries

- Provider nesting is `LangProvider → ThemeProvider → ManagerProvider → PhoneShell`.
- `Screen`, `NavParams`, `NavProps`, `PaymentType`, and resident `Amenity` are defined in `src/App.tsx`.
- Navigation uses React state, not URL routes or browser history. `navigate` pushes the current screen and parameters onto two history arrays; `goBack` restores both and falls back to `home`. Both attempt to reset `.app-scroll`.
- Resident tab order: Settings, Payments, Home, Reservations, News. Manager tab order: Settings, Overview, Units, Billing, News, Team. Detail/form pages hide the tab bar.
- Initial screen is `signin`. Resident sign-in goes to `home`; manager sign-in goes to `m-setup` when no property exists, otherwise `m-dashboard`.
- `m-settings` renders the same `Settings` component with `params.isManager: true`. Accounts also consumes this flag. Preserve the role and back destination when changing shared settings.
- `reservation-success` exists in the screen union but has no render branch. Booking success is local `confirmed` state inside `ReservationBooking`.
- Account add clears the active identity but keeps the in-memory account list; sign-out removes the active account. Sign-in and switching reset navigation history, while building data remains shared. This is not real authentication.

## State and feature connections

### Shared manager store

`useManager()` and `useManagerContext()` access the same context. Property starts as `null`; units, charges, announcements, and submissions start empty; staff starts with sample members. All this state survives screen changes within the mounted app but resets on page reload. IDs and temporary passwords are generated locally.

- Unit statuses: `occupied | invited | vacant`.
- Charge types: `apartment | water | energy | gas`; statuses: `pending | sent | paid`.
- Announcement categories: `Water | Gas | Energy | General`.
- Submission statuses: `pending | approved | rejected`, with a separate `golden` flag.
- Staff roles: `Owner | Property Manager | Front Desk | Maintenance | Accountant`. Role descriptions and the active toggle do not implement authorization checks.

Property setup records building configuration; it does not generate units automatically. Unit creation and credential actions update the shared units list, which feeds unit details and dashboard counts. Credential sending is simulated state, not email delivery or a connection to sign-in validation.

### Charges and resident payments

`ManagerChargeNew` creates one charge and updates unit balances. Its all-units branch adds the amount to every non-vacant unit; its specific-unit branch finds a unit by label. Manager overview and billing sum unpaid charge records. A single all-units charge is not a per-unit ledger: do not assume that sum equals the sum of unit balances.

The target currently stores a unit label or the translated `m_charge_all_units` text and compares against the current translation. This is a language-sensitive data contract to consider in billing changes. Prefer stable identifiers for new business logic; migrate all producers and consumers together if changing the existing representation.

Resident `Home`, `Payments`, `PaymentDetail`, and `MonthlyDetail` use separate hardcoded payment data and calculations. They do not consume manager charges or unit balances. Resident `PaymentType` excludes `gas`. Changes to an amount, date, or status require checking every related resident view for consistency. The PDF download action currently only displays temporary success feedback.

### News publication

There are three distinct sources:

1. Static sample `NewsItem[]` in `src/data/newsData.ts`.
2. Resident submissions: `NewsCreate → addNewsSubmission → ManagerNews reviewSubmission → usePublishedNews`.
3. Manager announcements: `ManagerNewsNew → addAnnouncement → ManagerNews`, manager dashboard bulletin count, and the resident feed.

`usePublishedNews` merges static news, **approved resident submissions** (IDs `10000 + id`), and published manager announcements (IDs `1000000 + newsId`). Preserve pending/rejected filtering and item identity when working on this flow.

`Home`, `News`, and `NewsDetail` all use `usePublishedNews`. Home currently shows only golden items. News supports All, Golden, Gas, Water, Energy, and General filters; Golden filters by the `golden` boolean, which is distinct from category. Home and News sort published resident submissions and manager announcements by their actual publication timestamp, newest first. Bundled samples have no publication timestamp, so they follow live items and sort among themselves by parsed date descending, then ID descending. Resident submissions receive a publication timestamp on manager approval; their displayed feed date is the approval date. `parseNewsDate` expects English `MMM D, YYYY` strings. Localizing displayed dates must not inadvertently change parser input and break sorting.

Golden is an independent boolean alongside a required Water/Gas/Energy/General category. Manager creation defaults Golden off and can enable it with a toggle; Golden items appear under both their main category and the Golden filter. Bundled sample news has English source copy and Persian copy in `newsDataFa.ts`; `usePublishedNews` picks copy by language while preserving IDs, category, flags, and sortable English source dates. Display dates are formatted separately. User- and manager-written text is stored and shown as entered, without machine translation. Read/unread flags are sample state; opening details does not update them. Invalid detail IDs currently fall back to the first news item.

### Reservations and time input

- Resident amenity IDs: `gym`, `rooftop`, `pool`, `guest-parking`, `community-hall`.
- Building configuration has a different shape: `pool`, `rooftop`, `gym`, `parking`, `lounge`, `laundry`. There is no automatic mapping from setup to resident availability.
- Home amenity cards and the Reservations list both open `reservation-booking`. Check both entry points after booking changes.
- Rooftop offers 21 dates starting today and day-only booking. Other amenities offer 14 dates starting today.
- Guest parking uses start/end time wheels and requires end time later than start time on the same day. Gym, pool, and community hall use fixed slots; `3:00 PM` is the sample unavailable slot.
- `TimeWheel` stores zero-padded `HH:mm`, with hours `00–23` and minutes `00–59`. It displays hour `00` as `24`, meaning midnight at the **start** of the day. Preserve that distinction in range validation; overnight booking is not currently supported.
- The wheel supports mouse wheel, pointer drag/click, keyboard controls, wrapping, and reduced-motion handling. Its hour/minute group deliberately uses `dir="ltr"` in both languages.
- Date strips and the home amenity strip include drag-versus-click suppression. Preserve touch, mouse, keyboard, and RTL scrolling when modifying them.
- Booking selection/confirmation are local state. Confirmation does not persist a reservation or update shared availability. Availability badges are independent sample data.

### Settings and persistence

- Since 2026-09-28, successful prototype sign-in records a password-free `currentUser` in the shared store. The trimmed value entered in the sign-in identifier field is the display name for either role; it is not replaced with a unit owner's or staff member's name. This is for display only, not credential verification.
- Home and Settings use `useProfile`; Accounts lists in-memory signed-in identities by role and identifier. Add Account opens sign-in while retaining that list, selection changes the active identity and role, and sign-out removes the active entry. Names remain unchanged when switching languages. News submissions record the current resident's name. Account identities reset on reload; business data retains its existing lifetime.

- Only language is persisted, in localStorage key `lumina_lang`; default is English. Storage access has a try/catch fallback.
- Language selection is pending until Confirm is pressed. Preserve this explicit application step.
- Dark mode is global React state, initially light, and is not persisted. Theme changes update root `--app-background` and `theme-color` metadata.
- Accent selection is local to Preferences and does not update theme tokens. Notification switches are local state, not push subscriptions. Feedback only shows local success. Accounts displays the current profile and links back to sign-in.

## English and Persian implementation rules

- Use `useLang()` (`lang`, `tr`, `isRTL`, `dir`) and add/update matching keys in both dictionaries in `src/translations.ts`. `fa` is typed against `typeof en`; preserve key parity.
- Translate new or changed UI copy, including placeholders, option/status labels, tooltips, accessibility labels, disabled states, and validation/success messages. Existing hardcoded English is not a precedent for adding more.
- Keep IDs, enum values, comparisons, sorting, and numeric data independent of translated text. Avoid `as any` for new translation lookups; prefer typed key maps.
- `.app-scroll` receives `dir={dir}`. Bottom navigation sits outside it, and HTML language comes from site configuration. Do not assume all UI inherits RTL or that switching language updates document `lang`.
- Prefer logical CSS (`textAlign: 'start'`, `marginInlineStart`, `paddingInlineEnd`, `borderInlineStart`) where direction matters. Mirror directional arrows appropriately; do not indiscriminately reverse all icons or numeric/time controls.
- Check Persian wrapping, mixed Persian/Latin identifiers, email addresses, links, and long labels. Preserve LTR islands where needed for technical values.
- Booking dates use `fa-IR` / `en-US` formatting. Payment month translations are Persian names of Gregorian months, not a Jalali conversion. Do not change calendars or currency just because language changes; preserve underlying dates/amounts and follow the requested feature's policy.
- Numeric fields currently use several ASCII-only regexes. When fixing numeric entry, consider Persian/Arabic digits and decimal handling before validation without corrupting stored numeric values.
- Test language changes in both directions and check business results and selected values. English fallback text is not evidence of completed Persian support.

## Visual, mobile, and PWA constraints

- Preserve the cream/off-white, dark green/teal identity, rounded cards, restrained spacing, and simple inline SVG icons. Reuse `useTheme().t` tokens for light/dark surfaces, text, borders, inputs, and statuses.
- Tailwind v4 is wired through Vite and `@import 'tailwindcss'` in `src/index.css`; no Tailwind or PostCSS config is needed. Components mix utility classes and inline token styles; follow nearby conventions.
- Global fonts belong in `src/index.css`; keep CSS imports before font-face rules and other declarations. Current font is DM Sans with system fallbacks.
- Desktop uses a 390px-wide, 844px-tall phone frame capped by viewport height. At widths up to 480px and in standalone/fullscreen mode, the app fills the viewport. `.app-scroll` is the inner scrolling region.
- Preserve dynamic viewport height, safe-area padding, bottom navigation reachability, and installed-app status-bar background when changing shell styles. Check fixed-position controls against both the desktop phone frame and mobile layout.
- `public/sw.js` registers through `main.tsx`, precaches the shell, uses network-first navigation and cache-first other same-origin GET requests, and removes other cache names on activation. A stale installed-app cache can affect displayed behavior; distinguish it from source behavior before changing code.
- Asset/deployment changes must consider Vite's base path, manifest/SW paths, and Nginx caching together. Do not clear user storage or alter service-worker behavior as a blanket fix.
- Components/screens normally use default exports; preserve existing named exports for shared hooks, types, providers, and `mui.tsx` helpers. Keep JSX balanced and use double quotes or escaping for apostrophes inside strings.

## Verification for future fixes

1. Reproduce the requested issue, identify its state owner, and note upstream/downstream consumers. Separate pre-existing prototype gaps from regressions introduced by the change.
2. Implement the smallest complete fix, including both languages and relevant shared behavior. Avoid broad formatting or unrelated changes.
3. For source changes, run `pnpm exec tsc --noEmit` and `pnpm build` when tooling is available. Report environment failures or pre-existing errors accurately; do not fix unrelated failures silently.
4. Exercise the affected flow in English/LTR and Persian/RTL, including validation, success, back navigation, tab state, and re-entry. Check both themes for visual changes and both roles when a shared component/store is affected.
5. Check dependent flows using the table below. Add focused regression tests when meaningful for nontrivial logic if appropriate tooling exists; a documentation or low-impact visual change does not require a new test framework.
6. Review the final diff for unintended files/behavior. Report what changed, what was verified, and relevant remaining limitations. Documentation-only changes need documentation/diff review, not deployment or an app rebuild.

| Changed area | Dependent flows to check |
| --- | --- |
| App navigation/providers | Both sign-in roles, setup entry, tabs, detail/back parameters, shared settings, sign-out/re-entry. |
| Units/charges | Unit creation/detail/list, specific/all-unit targets, vacant/invited/occupied balances, overview and billing totals. Inspect resident views if the task connects these sources. |
| News store/dates/feed | Submit, pending review, approve/reject, golden flag, Home, category filters, ordering, correct detail ID, back navigation. |
| Reservation/TimeWheel | Home/list entry points; rooftop, parking, and slot-based amenities; missing date/time; unavailable slot; equal/reversed/midnight ranges; confirmation; drag/click/keyboard behavior. |
| Language/theme/shared CSS/manager UI | Resident and manager consumers, both languages/themes, long content, numeric fields, phone frame/mobile layout, and safe areas where relevant. |
| PWA/hosting | Normal browser and installed app, reload/update behavior, asset base paths, shell fallback, affected cache behavior. |

## Maintaining this guide

Based on source inspection on 2026-09-27. The limitations above describe that snapshot, not desired permanent behavior or a complete bug list. Re-read the relevant implementation before fixing it. Update this guide when an authorized change alters architecture, state ownership, navigation, persistence, language conventions, or documented feature connections.
