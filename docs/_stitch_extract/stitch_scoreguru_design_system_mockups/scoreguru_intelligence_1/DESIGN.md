---
name: ScoreGuru Intelligence
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#cfc2d7'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#988ca0'
  outline-variant: '#4d4354'
  surface-tint: '#ddb8ff'
  primary: '#ddb8ff'
  on-primary: '#490080'
  primary-container: '#9333ea'
  on-primary-container: '#f6e6ff'
  inverse-primary: '#861fdd'
  secondary: '#ffb690'
  on-secondary: '#552100'
  secondary-container: '#ec6a06'
  on-secondary-container: '#4a1c00'
  tertiary: '#f7be1d'
  on-tertiary: '#3f2e00'
  tertiary-container: '#866500'
  on-tertiary-container: '#ffe9bf'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb8ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6800b4'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f7be1d'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-table:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for a high-performance sports intelligence platform that balances rapid data consumption with a premium editorial feel. The brand personality is authoritative yet energetic, designed to evoke the precision of professional sports analytics and the excitement of live competition. 

The aesthetic follows a **Modern Corporate** style with a "Sporty High-Tech" edge. It utilizes a dual-theme approach where the light mode emphasizes clarity and professional research, while the dark mode focuses on high-contrast immersion suitable for "war room" style game monitoring. Key visual drivers include strict grid adherence, vibrant "Live" status indicators, and a focus on legibility for dense statistical information.

## Colors

This design system uses a strategic palette designed for visibility and status communication. 

- **Primary Purple:** Used for branding, primary actions, and active navigation states.
- **Live Orange:** Reserved exclusively for "Live" indicators, breaking news, and urgent alerts.
- **Highlight Yellow:** Used for secondary callouts, player milestones, and "Gold" tier data features.

The color system is optimized for accessibility. In dark mode, surfaces use a tiered "elevation through luminosity" approach, where higher-level elements (like cards) use a slightly lighter navy-gray to distinguish them from the deep midnight background.

## Typography

The typography system prioritizes scanning efficiency. **Plus Jakarta Sans** provides a modern, energetic feel for headings and branding. **Inter** is utilized for body copy and data-heavy layouts due to its exceptional legibility and neutral character.

For scoreboards and statistics, the design system leverages Inter's tabular figures to ensure numbers align perfectly in columns. All labels for categories (e.g., "AST", "REB", "PTS") should use the `label-caps` style to distinguish metadata from actual data.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop, transitioning to a **4-column grid** on mobile devices. 

- **Spacing Rhythm:** Built on a 4px baseline, with 16px (md) as the standard padding for cards and containers.
- **Density:** To accommodate large datasets, the design system allows for "Compact" views where vertical spacing is reduced to 8px (sm).
- **Margins:** Desktop margins are set to 32px (xl) to provide breathing room, while mobile margins are set to 16px (md).

## Elevation & Depth

Hierarchy is established differently across the two themes to maintain visual integrity:

- **Light Mode:** Uses **Ambient Shadows**. Surfaces sit on the `#F6F7FB` background with a subtle 1px border and a soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)).
- **Dark Mode:** Uses **Tonal Layers** and **High-Contrast Outlines**. Instead of shadows, depth is conveyed by stepping from the background (`#0B1020`) to a surface (`#111827`) and finally to elevated components (`#1F2937`). All containers in dark mode must have a 1px border of `#374151` to ensure separation.

Floating elements like dropdowns or tooltips should use a "Primary Purple" tinted shadow in dark mode to suggest depth without relying on pure black.

## Shapes

The design system uses a consistent **8px (0.5rem)** corner radius for all primary UI components, such as cards, buttons, and input fields. This provides a modern, approachable feel that isn't overly organic or "bubbly."

- **Rounded-LG:** Used for large containers or image carousels (16px).
- **Rounded-XL:** Used for modal overlays and bottom sheets (24px).
- **Pill:** Strictly reserved for status tags (e.g., "Final", "Half-time") and small action chips.

## Components

### Buttons
- **Primary:** Solid `#9333EA` with white text. 8px rounded corners.
- **Secondary:** Outlined with primary purple. 
- **Live Action:** Orange background with pulsing animation for live match access.

### Cards
Cards are the primary data container. They must feature a 1px border. In dark mode, card headers should use a slightly darker background than the card body to create clear sectioning.

### Data Tables
Tables are high-density. Rows should have a subtle hover state (`#F9FAFB` in light, `#1F2937` in dark). Column headers use `label-caps` typography.

### Input Fields
Inputs use a 1px border. On focus, the border transitions to Primary Purple with a 2px outer glow (ring).

### Status Chips
- **Live:** Orange background, white text, pill-shaped.
- **Scheduled:** Muted background, primary text.
- **Highlight:** Yellow background, dark text (`#111827`).

### Scoreboards
Scoreboards should use `headline-lg` for the scores themselves and `label-caps` for the team abbreviations. Vertical dividers between team sections should be 1px wide and use the theme's border color.