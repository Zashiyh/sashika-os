# SASHIKA OS — Cyber Edition

An interactive portfolio for **Sashika Madushan**, presented as a retro-futuristic
operating system running inside a 3D monitor.

```
Boot (CRT + BIOS + loading bar) → 3D monitor + lock screen → fictional "access granted"
→ camera push-in + glitch → desktop (windows, taskbar, start menu, terminal)
```

## Run it

```bash
npm ci
npm run dev            # http://localhost:3000
npm run build && npm start
npx tsc --noEmit       # type-check (strict mode)
npm run lint
```

The original single-page site is still available at **`/classic`**.

## Contact form (optional)

Copy `.env.example` to `.env.local` and fill in:

| Variable             | Required | Purpose                                                   |
| -------------------- | -------- | --------------------------------------------------------- |
| `RESEND_API_KEY`     | yes\*    | API key from [resend.com](https://resend.com)             |
| `CONTACT_TO_EMAIL`   | yes\*    | Inbox that receives messages                              |
| `CONTACT_FROM_EMAIL` | no       | Verified sender (defaults to `onboarding@resend.dev`)     |

\* Without them `/api/contact` answers `503 not_configured` and the form switches to a
pre-filled "Open in email app" link plus copy-email. Nothing breaks. The route validates
input on the server, has a honeypot field, and rate-limits each IP to 5 messages per 10 minutes.

## Editing content

**All content lives in `data/portfolio.ts`**: profile, projects, skills, education,
experience, certificates and social links. The desktop, terminal, Start-menu search,
no-JS fallback and JSON-LD all read from it.

- Projects: set `status`, `github`, `demo`, `features` and `image`. Leave `demo` empty
  if there is no live deployment, so no broken buttons are shown.
- `detailsPending: true` shows an honest "details coming soon" label.
- `experience` and `certificates` are empty arrays on purpose. The windows show a clear
  empty state until real entries are added. Do not add placeholders.
- Skills have no percentages. The Skills window lists the projects that use each skill.

## Structure

```
app/
  page.tsx               server page → <SashikaOS/>, <noscript> text version, JSON-LD
  layout.tsx             fonts, metadata, viewport
  api/contact/route.ts   Resend-backed contact endpoint
  classic/               the original portfolio (layout + page + classic.css)
components/os/
  SashikaOS.tsx          phase orchestrator (boot → lock → desktop), 3D/2D decision
  OSProvider.tsx         theme, reduced motion, lite mode, glitch, notifications
  AudioController.tsx    optional WebAudio UI sounds (off by default)
  boot/BootSequence.tsx
  lock/LockScreen.tsx, AccessSequence.tsx
  scene/                 R3F monitor (lazy-loaded), camera rig, 2D fallback, error boundary
  desktop/               DesktopEnvironment, WindowManager, PortfolioWindow, Taskbar,
                         StartMenu, DesktopIcon, NotificationArea
  apps/                  About, Projects explorer, Skills, Experience, Education,
                         Certificates, Contact, Terminal, System info (each code-split)
data/portfolio.ts        single source of truth for content
lib/os/                  app registry, window reducer, terminal commands, sounds, storage
hooks/                   clock, media queries, visibility, WebGL detection, viewport size
styles/os.css            OS design tokens and themes (cyber / retro)
```

## Performance and accessibility

- three.js is loaded with `next/dynamic` (`ssr: false`), only when it's needed, and
  pre-fetched during the boot animation. Every app window is a separate chunk.
- 3D is used only on hardware-accelerated WebGL with a viewport of at least 1024 px
  and a landscape aspect. Software renderers, context loss, render errors or frame
  rates below ~20 fps switch to the 2D lock screen. `?3d=force` overrides the
  WebGL check for testing.
- Rendering pauses when the tab is hidden (`frameloop="never"`, CSS animations paused).
- `prefers-reduced-motion` is respected, and a manual "Reduce motion" toggle is in the
  lock screen and Start menu.
- The intro can be skipped (Esc, button, "always skip" checkbox). Deep links such as
  `/?app=projects` or `/#contact` go straight to the desktop.
- Windows are dialogs with focus management. Desktop icons use arrow-key roving focus.
  Esc closes menus. Toasts use `aria-live`.

## Shortcuts and easter eggs

| Keys                   | Action                                         |
| ---------------------- | ---------------------------------------------- |
| `Alt+Shift+M`          | Start menu                                     |
| `Alt+Shift+D`          | Show desktop                                   |
| `Alt+Shift+Y`          | Toggle cyber / classic retro theme             |
| `Alt+Shift+W`          | Close active window                            |
| `Alt+Shift+<letter>`   | Open app (hints shown in the Start menu)       |
| ↑↑↓↓←→←→BA             | Konami code                                    |
| `ayubowan` in Terminal | Secret message                                 |

The "authentication" on the lock screen is a fictional animation. It never asks for a
password, collects personal data or scans the visitor.
