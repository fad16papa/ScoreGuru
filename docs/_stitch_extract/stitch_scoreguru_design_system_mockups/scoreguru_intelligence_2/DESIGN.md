---
name: ScoreGuru Intelligence
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#4d4354'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#7e7386'
  outline-variant: '#cfc2d7'
  surface-tint: '#861fdd'
  primary: '#7800ce'
  on-primary: '#ffffff'
  primary-container: '#9333ea'
  on-primary-container: '#f6e6ff'
  inverse-primary: '#ddb8ff'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#684e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#866500'
  on-tertiary-container: '#ffe9bf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
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
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
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
  2xl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system for this sports intelligence platform is built on a **Modern Corporate** aesthetic with a high-performance edge. It prioritizes clarity, speed, and data density to serve professional analysts and enthusiasts. The interface evokes a sense of "intelligence" through a premium, light-mode-first environment that uses high-contrast accents to signal urgency and live action.

The style leverages a systematic approach to data visualization, using white elevated surfaces against a cool light-gray background to create a structured hierarchy. The emotional response should be one of reliability and precision, ensuring that complex statistics remain accessible and actionable.

## Colors
The palette is engineered for a data-rich dashboard. 

- **Primary Purple** is the anchor for navigation and primary actions, representing the brand's premium positioning.
- **Orange (Live)** is reserved exclusively for real-time updates and urgent match statuses to draw immediate ocular attention.
- **Yellow (Trending)** highlights hot streaks, viral plays, or high-value insights.
- **Neutrals** use a "Cool Gray" scale to keep the interface feeling fresh and modern, avoiding the "heavy" feeling of pure black.

Use the background color `#F6F7FB` for the main canvas, allowing white `#FFFFFF` cards to "pop" via elevation.

## Typography
This design system employs a three-font strategy to balance impact, readability, and technical precision:

1.  **Archivo Narrow** is used for headlines and scoreboards. Its condensed nature allows for longer team names and large numbers without breaking layouts.
2.  **Inter** serves as the workhorse for all body copy, descriptions, and UI labels, ensuring maximum legibility across all devices.
3.  **JetBrains Mono** is utilized for specific data points, betting odds, and timestamps. The monospaced nature ensures that fluctuating numbers don't cause "layout jitter" and remain perfectly aligned in tables.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for responsive dashboard environments. 

- **Desktop:** A 12-column grid with a 20px gutter. Sidebars are typically fixed at 280px, with the main content area expanding.
- **Tablet:** An 8-column grid. Sidebars collapse into a "rail" or a hamburger menu.
- **Mobile:** A 4-column grid with 16px margins. Content cards stack vertically.

Spacing follows a strict 4px base unit. Use `md` (16px) for standard padding within cards and `lg` (24px) for spacing between major sections.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and subtle ambient shadows rather than heavy gradients.

- **Level 0 (Background):** `#F6F7FB`.
- **Level 1 (Cards):** White surfaces with a 1px border of `#E5E7EB` and a "Soft" shadow (0 4px 6px -1px rgb(0 0 0 / 0.05)).
- **Level 2 (Active/Hover):** White surfaces with a "Floating" shadow (0 10px 15px -3px rgb(0 0 0 / 0.08)).
- **Overlays:** Modals use a backdrop blur (8px) with a semi-transparent dark overlay to maintain focus on the data.

## Shapes
The shape language is "Rounded," striking a balance between the aggressive sharpness of traditional sports media and the approachability of modern SaaS. 

- **Standard Buttons & Inputs:** 0.5rem (8px).
- **Cards & Modals:** 1rem (16px).
- **Live Status Badges:** Full pill-shaped for immediate distinction.

## Components
- **Buttons:** Primary buttons use Purple `#9333EA` with white text. Ghost buttons use a 1px border of the Primary color.
- **Live Badges:** Use Orange `#F97316` with an animating "pulse" dot to indicate real-time data.
- **Data Tables:** Use JetBrains Mono for all numeric columns. Header rows should have a subtle gray background (`#F9FAFB`) and `body-sm` bold text.
- **Score Cards:** Utilize Archivo Narrow for the scores. Use a left-accent border (4px) in the team's color or the Primary purple to denote the current winner.
- **Input Fields:** 0.5rem roundedness with a 1px border. On focus, the border shifts to Primary Purple with a 3px soft outer glow.
- **Trend Indicators:** Small upward/downward arrows using Green (Success) or Red (Error) tones, strictly for movement, distinct from the brand's Orange/Yellow highlights.