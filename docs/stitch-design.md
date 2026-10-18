---
name: Apex Service Desk
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daf4'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d9e2fc'
  on-surface: '#121b2e'
  on-surface-variant: '#434654'
  inverse-surface: '#273044'
  inverse-on-surface: '#edf0ff'
  outline: '#747686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1f54d3'
  primary: '#003fb3'
  on-primary: '#ffffff'
  primary-container: '#2457d6'
  on-primary-container: '#d5dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#0054cb'
  on-secondary: '#ffffff'
  secondary-container: '#346ee5'
  on-secondary-container: '#fefcff'
  tertiary: '#832f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#aa3f00'
  on-tertiary-container: '#ffd5c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00164d'
  on-primary-fixed-variant: '#003cad'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b1c5ff'
  on-secondary-fixed: '#001847'
  on-secondary-fixed-variant: '#0040a0'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb597'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7e2c00'
  background: '#f9f9ff'
  on-background: '#121b2e'
  surface-variant: '#d9e2fc'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for an enterprise IT Service Management (ITSM) and operations hub. The brand identity projects absolute technical competence, reliability, low cognitive friction, and calm precision during critical incidents.

The visual style is **Corporate / Modern High-Density**. It utilizes crisp structural definition, rigorous typography hierarchy, and purposeful semantic accents. Rather than relying on decorative visual treatments, the interface treats data density as a primary asset—ensuring incident queues, SLA countdowns, change requests, and configuration items are parseable within fractions of a second.

## Colors

The palette is engineered specifically for situational awareness, high legibility, and minimal visual fatigue across lengthy operational shifts.

### Surfaces & Neutrals
- **Canvas Background (`#F5F7FA`):** Cool, low-glare foundation that provides subtle separation against white containers.
- **Surface Layer 1 (`#FFFFFF`):** High-clarity white for cards, tables, panels, and input fields.
- **Surface Layer 2 (`#EEF2F6`):** Secondary container backgrounds, table headers, and neutral chip backings.
- **Primary Text (`#172033`):** Deep charcoal-slate delivering AAA-compliant contrast for body text and headers.
- **Muted Text (`#586579`):** Subdued slate for secondary metadata, system labels, timestamps, and breadcrumbs.
- **Structural Border (`#DCE2EA`):** Crisp, subtle division line for tables, cards, modal dividers, and input borders.

### Primary Brand
- **Brand Primary (`#2457D6`):** Authoritative royal blue driving key interactive affordances, active sidebar highlights, and primary actions.
- **Brand Light (`#EFF4FF`):** Soft blue backdrop for selected rows and active navigational states.

### Semantic Status Tokens
Every status indicator employs paired high-contrast text against a tinted background to maximize readability without inducing alarm fatigue:
- **Danger / P1 Incident:** Text `#B42318` on Background `#FEF3F2` (Border: `#FECDCA`).
- **Warning / SLA Approaching:** Text `#9A5B00` on Background `#FEF7C3` (Border: `#FEDF89`).
- **Success / Resolved:** Text `#167647` on Background `#ECFDF3` (Border: `#A6F4C5`).
- **Info / In Progress:** Text `#175CD3` on Background `#EFF8FF` (Border: `#B2DDFF`).

## Typography

Typography is standardized on **Inter** to ensure dense yet balanced tabular rendering, exceptional x-height clarity, and legible numeric readouts. Tabular figures (`tnum`) should be enabled across ticket tables, timers, and SLA counters. **JetBrains Mono** is reserved strictly for configuration items, error stack traces, IP addresses, and ticket IDs.

## Layout & Spacing

The layout operates on an uncompromising 8px baseline grid (with a 4px sub-grid for fine internal alignment).

### Shell Frame
- **Top Header:** 64px fixed height spanning 100% width, fixed to the viewport top, housing global search, incident creation CTAs, notification hubs, and agent profile metrics.
- **Left Navigation Drawer:** 240px expanded width, collapsing down to 64px icon-only rail on toggle or smaller viewports.
- **Work Area Canvas:** Fluid main container targeting 1440px standard enterprise desktop viewports with a 24px outer margin.

### Grid Rhythm
- **Columns & Gutters:** 12-column layout with 16px (`gutter`) gutters between panels, KPI tiles, and split-pane triage views.
- **Split-Pane Layout:** For incident views, the canvas bifurcates into a 65% primary diagnostic/resolution column and a 35% contextual sidebar (SLA timelines, requester info, related assets).

## Elevation & Depth

To avoid visual noise in data-heavy screens, depth is achieved primarily through crisp borders (`#DCE2EA`) combined with restrained, low-opacity ambient shadows.

- **Level 0 (Flat Canvas):** `#F5F7FA` canvas background without shadow.
- **Level 1 (Card & Row Baseline):** `#FFFFFF` surfaces with a 1px solid `#DCE2EA` border and subtle ambient shadow: `0 1px 2px 0 rgba(16, 24, 40, 0.05)`.
- **Level 2 (Popovers, Filter Drawers & Hovered Cards):** `0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)`.
- **Level 3 (Modals & Escalation Overlays):** `0 20px 24px -4px rgba(16, 24, 40, 0.1), 0 8px 8px -4px rgba(16, 24, 40, 0.04)` combined with a 40% opacity slate overlay backdrop.

## Shapes

The interface balances sharp enterprise efficiency with approachable modern software aesthetics. Structural containers adhere to 8px (`0.5rem`) corner radii, maintaining tight boundary discipline in dense grids. Form elements, toolbars, and cards use 8px, while modal dialogues and slide-over drawers use 12px (`0.75rem`). Badges and status pills leverage a full rounded radius for instant component differentiation.

## Components

### Buttons
- **Primary:** Background `#2457D6`, text `#FFFFFF`, border-radius 8px, padding 8px 16px. Height 36px (compact 32px for table row actions). Hover: `#1D46AF`. Focus: 3px ring of `#2457D6` at 20% opacity.
- **Secondary / Outline:** Background `#FFFFFF`, border 1px solid `#DCE2EA`, text `#172033`. Hover: Background `#F5F7FA`, border `#CCD4E0`.
- **Destructive:** Background `#B42318`, text `#FFFFFF`. Hover: `#912018`.

### Status Badges & Chips
- Heights are fixed at 22px with 6px horizontal padding and fully rounded edges (`9999px`).
- Always pair a 12px iconography glyph or 6px solid circular dot with semibold uppercase `label-sm` text (e.g., `P1 - CRITICAL`, `SLA AT RISK`).
- Apply the semantic color pairings defined in the color specification. Never use color alone to convey state.

### Incident Data Tables
- Header row height: 38px, background `#F8FAFC`, uppercase `label-sm` muted text `#586579`.
- Data row height: 44px (high-density), alternating hover state with `#F8FAFC`, active state with `#EFF4FF`.
- Border-bottom 1px solid `#DCE2EA`. Cell padding: 0 12px.

### Form Inputs & Selects
- Height 36px, background `#FFFFFF`, border 1px solid `#DCE2EA`, border-radius 8px, padding 0 12px.
- Placeholder text `#8E9BAE`. Focus state transitions border to `#2457D6` with a soft blue outer glow (`0 0 0 3px rgba(36, 87, 214, 0.12)`).

### Metric & SLA Cards
- Background `#FFFFFF`, 1px solid `#DCE2EA`, 8px rounded corners, 16px internal padding.
- Include miniature sparkline or radial progress bar for SLA time-to-breach metrics.