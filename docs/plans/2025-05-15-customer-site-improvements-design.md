# FONUS Customer Site Improvements: Design Document

> **Goal:** Enhance the customer-facing marketing site of FONUS CEBU FEDERATION COOPERATIVE with improved UX, Trust, and Accessibility features.

**Architecture:**
- Use the existing Next.js App Router and Tailwind CSS v4 structure.
- Content is managed through a central `siteData.ts` file, making it easy to update.
- Implement a simple translation mechanism (multi-language) without using heavy libraries (YAGNI).

**Tech Stack:**
- Next.js (App Router), Tailwind CSS v4, Lucide-React, DaisyUI.
- `framer-motion` for subtle animations (optional, if we want "Modern Cards").

---

## 4. Scroll Animations (Visual Polish)

### Approach:
- Use **Framer Motion** for high-quality, performant animations.
- Implement a `Reveal` wrapper component that detects when an element is in view.
- Animations: Subtle "Slide Up" and "Fade In" (approx 0.5s duration with a slight delay).
- Staggered children animations for lists (like Plan Features or Benefits) to create a "wave" effect.

### Aesthetics:
- Avoid "bouncy" or "fast" animations.
- Focus on "elegant" and "smooth" transitions that match the Playfair Display (Serif) typography.

---
