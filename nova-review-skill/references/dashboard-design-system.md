# Dashboard Design System — AI SaaS Grade

Use this in Phase 5 (design spec) and Phase 6 Track E (implementation).

---

## Design Philosophy

The Nova dashboard should feel like a **professional tool built for power users** — not a marketing website.

References to draw from (tone, not copy):
- **Linear** — speed, keyboard-first, minimal chrome
- **Vercel** — dark, data-dense, confident typography
- **Supabase** — structured, high-information-density, well-organized
- **Raycast** — command-first, fast, feels native
- **Hex** — beautiful data product, polished without being flashy

### The Three Rules
1. **Fast** — every interaction under 100ms perceived
2. **Clear** — the user always knows where they are and what to do next
3. **Trustworthy** — data feels accurate, up-to-date, and reliable

---

## Color System

### Base Palette (Dark Theme — Primary)

```css
:root {
  /* Backgrounds — layered depth */
  --bg-base:       #08080E;   /* Page background */
  --bg-surface:    #0F0F1A;   /* Card / panel surface */
  --bg-elevated:   #16162A;   /* Modals, dropdowns */
  --bg-overlay:    #1C1C32;   /* Hover states, subtle highlights */

  /* Borders */
  --border-subtle: #1A1A2E;   /* Default card borders */
  --border-muted:  #252540;   /* Stronger dividers */
  --border-focus:  #4040A0;   /* Focus rings */

  /* Brand — pick ONE bold primary for Nova */
  --brand-primary: #6366F1;   /* Indigo — replace with Nova's brand color */
  --brand-dim:     #3730A3;   /* Darker brand for hover states */
  --brand-glow:    rgba(99, 102, 241, 0.15); /* Ambient glow */

  /* Accent — used sparingly for highlights */
  --accent:        #22D3EE;   /* Cyan — data highlights, active states */
  --accent-dim:    rgba(34, 211, 238, 0.12);

  /* Semantic */
  --success:       #10B981;
  --success-dim:   rgba(16, 185, 129, 0.12);
  --warning:       #F59E0B;
  --warning-dim:   rgba(245, 158, 11, 0.12);
  --error:         #EF4444;
  --error-dim:     rgba(239, 68, 68, 0.12);

  /* Text */
  --text-primary:  #F0F0FA;   /* Headlines, important values */
  --text-secondary:#A0A0C0;   /* Labels, descriptions */
  --text-muted:    #60607A;   /* Timestamps, metadata */
  --text-disabled: #30304A;   /* Disabled controls */
}
```

### Light Theme Override (Optional)

```css
[data-theme="light"] {
  --bg-base:       #FAFAFA;
  --bg-surface:    #FFFFFF;
  --bg-elevated:   #F5F5FF;
  --bg-overlay:    #EFEFFF;
  --border-subtle: #E5E5F0;
  --border-muted:  #D0D0E8;
  --text-primary:  #0F0F1A;
  --text-secondary:#4A4A6A;
  --text-muted:    #8A8AAA;
}
```

---

## Typography

### Font Pairings (pick one based on Nova's brand tone)

**Option A — Precise & Technical** (Vercel-like)
```css
--font-display: 'Geist', 'IBM Plex Sans', sans-serif;
--font-body:    'Geist', sans-serif;
--font-mono:    'Geist Mono', 'JetBrains Mono', monospace;
```

**Option B — Elegant & Modern** (Linear-like)
```css
--font-display: 'Cal Sans', 'Satoshi', sans-serif;
--font-body:    'Satoshi', 'Inter', sans-serif;
--font-mono:    'Fira Code', monospace;
```

**Option C — Bold & Distinctive** (Data-product-like)
```css
--font-display: 'DM Sans', sans-serif;
--font-body:    'DM Sans', sans-serif;
--font-mono:    'DM Mono', monospace;
```

### Type Scale

```css
--text-xs:   11px / line-height: 1.4  /* Labels, badges */
--text-sm:   13px / line-height: 1.5  /* Body, secondary */
--text-base: 15px / line-height: 1.6  /* Primary body */
--text-lg:   18px / line-height: 1.4  /* Subheadings */
--text-xl:   24px / line-height: 1.3  /* Section headings */
--text-2xl:  32px / line-height: 1.2  /* Page titles */
--text-3xl:  48px / line-height: 1.1  /* Hero metrics */
```

---

## Spacing & Layout

```css
/* Base unit: 4px */
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px

/* Border radius */
--radius-sm:  4px   /* Inputs, tags */
--radius-md:  8px   /* Cards, buttons */
--radius-lg:  12px  /* Modals, panels */
--radius-xl:  16px  /* Large cards */
--radius-full: 9999px /* Pills, avatars */

/* Shadows */
--shadow-sm:  0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6);
--shadow-md:  0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4);
--shadow-lg:  0 10px 30px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4);
--shadow-glow: 0 0 20px var(--brand-glow);
```

---

## Layout Architecture

### Shell Structure

```
┌─────────────────────────────────────────────────────┐
│  Topbar: Logo | Breadcrumb        Search | User      │  48px
├──────────┬──────────────────────────────────────────┤
│          │  Page Header: Title + Actions             │  64px
│ Sidebar  ├──────────────────────────────────────────┤
│  240px   │                                          │
│ (64px    │  Content Area                            │
│ collapsed│  — Grid layout                           │
│ state)   │  — 24px gutters                          │
│          │  — Max width: 1280px centered             │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Sidebar

```
Collapsed (64px wide):   Icon only — tooltip on hover
Expanded (240px wide):   Icon + label
Transition:              width 200ms cubic-bezier(0.4, 0, 0.2, 1)

Sections:
  — Logo / product name (top)
  — Primary nav items (middle)
  — Workspace switcher (optional)
  — Settings + profile (bottom)
```

### Content Grid

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
  padding: var(--space-8);
  max-width: 1280px;
}

/* Common spans */
.col-span-3  { grid-column: span 3; }  /* Metric card */
.col-span-4  { grid-column: span 4; }  /* Small panel */
.col-span-6  { grid-column: span 6; }  /* Half width */
.col-span-8  { grid-column: span 8; }  /* Main chart */
.col-span-12 { grid-column: span 12; } /* Full width table */
```

---

## Component Specs

### Metric Card

```
┌─────────────────────────────┐
│ Icon  Label              ↑  │  ← Header row
│                             │
│ 42,891                      │  ← Big number (--text-3xl)
│ +12.4% vs last month        │  ← Trend (green/red)
│ ▂▃▅▇▆▄ (sparkline)          │  ← Optional mini chart
└─────────────────────────────┘
Height: 140px
Border: 1px solid var(--border-subtle)
Background: var(--bg-surface)
Hover: border-color → var(--border-muted), translateY(-2px)
```

### Data Table

```
Header: sticky, background var(--bg-elevated), border-bottom
Rows: alternating subtle shade, 48px height
Hover row: background var(--bg-overlay)
Actions: appear on row hover (opacity 0 → 1)
Empty state: centered illustration + CTA
Loading: skeleton rows (shimmer animation)
Pagination: bottom, shows X-Y of Z
```

### Chart Container

```
Background: var(--bg-surface)
Padding: var(--space-6)
Header: title (left) + time-range selector (right)
Chart area: recharts or Chart.js, use CSS var colors
Tooltip: var(--bg-elevated), 1px border, no shadow
Empty: centered text + subtle grid lines
Loading: skeleton that matches chart shape
```

### Badge / Status Pill

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}
.badge-success { background: var(--success-dim); color: var(--success); }
.badge-warning { background: var(--warning-dim); color: var(--warning); }
.badge-error   { background: var(--error-dim);   color: var(--error);   }
```

---

## Animation System

### Principles
- **Purposeful**: animations communicate state, not just look nice
- **Fast**: most transitions 150-250ms
- **Easing**: ease-out for entrances, ease-in for exits, ease-in-out for state changes

### Animation Tokens

```css
--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Slight overshoot */

--duration-fast:   100ms;
--duration-base:   200ms;
--duration-slow:   350ms;
--duration-chart:  600ms;
```

### Animation Catalog

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page enter | fadeIn + translateY(8px→0) | 200ms | ease-out |
| Page exit | fadeOut + translateY(0→-8px) | 150ms | ease-in |
| Card mount | fadeIn + scale(0.98→1) | 200ms stagger 50ms | ease-out |
| Sidebar expand | width transition | 200ms | ease-in-out |
| Modal open | fadeIn + scale(0.95→1) | 200ms | ease-spring |
| Toast in | translateX(100%→0) + fadeIn | 250ms | ease-spring |
| Toast out | translateX(0→100%) + fadeOut | 200ms | ease-in |
| Skeleton | shimmer (gradient sweep) | 1.5s loop | linear |
| Metric number | count-up from 0 | 800ms | ease-out |
| Chart draw | strokeDashoffset / opacity | 600ms | ease-out |
| Hover lift | translateY(-2px) + shadow | 150ms | ease-out |
| Button press | scale(0.97) | 100ms | ease-in |
| Dropdown open | fadeIn + translateY(-4px→0) | 150ms | ease-out |

### CSS Animations

```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-overlay) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
```

---

## Interaction Patterns

### Command Palette (Cmd+K)
- Full-screen overlay, centered input
- Real-time fuzzy search across nav items, pages, recent items, actions
- Keyboard navigation (↑↓ to move, Enter to select, Esc to close)
- Sections: Recent, Actions, Navigation, Settings

### Data Refresh
- Show last-updated timestamp next to data headers
- Manual refresh button (icon) with rotation animation on click
- Auto-refresh for real-time sections with subtle pulse indicator

### Notifications / Toasts
- Bottom-right corner, stack max 3
- Auto-dismiss: 4s for success, 6s for error, 8s for warning
- Dismiss on click
- Never block interactive content

### Confirmation Dialogs
- Use for irreversible actions only (delete, revoke, clear)
- Destructive button: red, right-aligned
- Cancel: always keyboard accessible (Esc)
- Never use browser `confirm()` — always custom modal

---

## Implementation Notes for React

```jsx
// Framer Motion page transition wrapper
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
>

// Staggered card list
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

// Use CSS custom properties for all colors — never hardcode
// All spacing via utility classes or CSS vars — never arbitrary px in JSX
```
