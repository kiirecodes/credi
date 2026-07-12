---
name: The Intelligent Protector
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058bb'
  on-secondary: '#ffffff'
  secondary-container: '#1e71e2'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
  risk-safe: '#16A34A'
  risk-caution: '#D97706'
  risk-high: '#DC2626'
  surface-subtle: '#F8FAFC'
  border-muted: '#E2E8F0'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
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
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  margin-desktop: 2rem
  margin-mobile: 1rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system embodies the persona of "The Intelligent Protector"—a guardian that decodes complex financial data into actionable security. The brand personality is authoritative yet accessible, providing the user with a sense of clarity and safety in high-stakes decision-making. 

The aesthetic follows a **Corporate / Modern** style with a focus on data density and high-contrast semantics. It prioritizes institutional reliability through a structured grid, precise typography, and a refined "dashboard-first" philosophy. The visual language is purposefully lean, avoiding unnecessary ornamentation to ensure the user's focus remains on risk indicators and financial metrics.

## Colors
This design system utilizes a foundation of deep navy and charcoal tones to establish authority. The primary color is a dark, sophisticated navy used for headers and structural elements. The secondary "Action Blue" is reserved for interactive elements like primary buttons and navigation links.

A strict semantic color system—the "Traffic Light" model—is applied to risk assessments. **Risk-Safe (Green)** indicates low-risk offers, **Risk-Caution (Amber)** flags potential concerns, and **Risk-High (Red)** signals immediate danger or system errors. Neutral surfaces use a layered approach of pure white and extremely light grays to separate data sections without creating visual noise.

## Typography
The typography system is designed for maximum legibility of complex strings. **Hanken Grotesk** is used for headlines to provide a modern, sharp, and professional character. **Inter** serves as the workhorse for all body text, chosen for its exceptional readability in data-heavy environments. 

For technical data, loan IDs, and API endpoints, **JetBrains Mono** is utilized as the label font. This monospaced choice reinforces the "intelligent" and precise nature of the analysis. For mobile screens, headlines scale down to prevent excessive wrapping while maintaining high contrast.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop dashboards, centering content within a 1280px max-width container to prevent eye strain. On smaller screens, the layout transitions to a fluid, single-column stack.

The vertical rhythm is governed by a strict "Stack" model (8px, 16px, 32px), ensuring that related data points (like loan details) are grouped tightly while major sections (like Risk Analysis vs. History) have significant breathing room. Data tables should utilize a condensed horizontal padding to maximize information density without sacrificing clarity.

## Elevation & Depth
In alignment with the professional and technical nature of the brand, depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 

1.  **Level 0 (Base):** The main background using pure white.
2.  **Level 1 (Surface):** Subtle light-gray containers used to group related loan data or table rows.
3.  **Level 2 (Active):** Interactive elements or focused cards use a soft, 1px border (`#E2E8F0`) to define boundaries.
4.  **Level 3 (Overlay):** Modals and dropdowns use a very thin, diffused ambient shadow with a 0.05 opacity to lift them slightly from the interface.

## Shapes
The shape language is **Soft** and precise. A standard corner radius of 4px-6px is applied to all structural elements, including cards, inputs, and buttons. This minimal rounding maintains a serious, institutional feel while subtly softening the technical edge. Status badges for risk levels use a slightly higher roundedness (Pill) to distinguish them from functional UI components.

## Components
-   **Risk Meters:** Use a semi-circular or linear gauge. The fill color must dynamically transition between the semantic status colors based on the numerical risk score.
-   **Data Tables:** Headers should be sticky with a subtle bottom border. Use `label-md` for headers (all caps) and `body-sm` for row data. Alternate row shading (Zebra striping) is encouraged for high-density loan tables.
-   **Buttons:** 
    -   *Primary:* Filled with `#0969DA`, white text, 4px radius.
    -   *Secondary:* Outlined with `#E2E8F0`, navy text.
    -   *Risk-Action:* Filled with `#DC2626` only for destructive or high-risk overrides.
-   **Input Fields:** Ghost-style borders that darken on focus. Use `inter` for user-inputted text and `jetbrainsMono` for system-generated values.
-   **Risk Chips:** Small, pill-shaped badges for "SAFE", "CAUTION", or "HIGH RISK". These should use a background tint of the semantic color (15% opacity) and a high-contrast text color of the same hue.
-   **Protection Cards:** Used for summaries. They should feature a clear header, a bold risk status icon (using Lucide React), and a primary call-to-action for "View Details."