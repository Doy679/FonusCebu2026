# FONUS Customer Site Improvements Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the customer-facing site with UX, Trust, and Reach features.

**Architecture:** Use existing Next.js structure. Add a `translations` system. Enhance components.

**Tech Stack:** Next.js (App Router), Tailwind v4, DaisyUI, Lucide-React.

---

### Task 1: UX - Plan Comparison & Pricing Calculator

**Files:**
- Modify: `FONUS-CEBU/src/data/siteData.ts` (add `spotCashSavings` and `fullContractYears`)
- Modify: `FONUS-CEBU/src/components/Services.tsx` (implement interactive cards and pricing calculator)
- Test: Manually verify the pricing calculation and card layout.

**Step 1: Update siteData.ts**
Add `fullContractYears` (5) and `spotCashSavings` (percentage) to each package or globally.

**Step 2: Enhance Services.tsx**
Add a state for `priceMode` ('monthly' | 'spot').
Modify the card rendering to show the price based on `priceMode`.
Show a "You save: ₱XXX" badge when in `spot` mode.

**Step 3: Verification**
Verify that switching the toggle/tabs updates the prices correctly.

---

### Task 2: Trust - FAQ & Testimonials

**Files:**
- Modify: `FONUS-CEBU/src/data/siteData.ts` (add `faqs` and `testimonials`)
- Create: `FONUS-CEBU/src/components/FAQ.tsx`
- Create: `FONUS-CEBU/src/components/Testimonials.tsx`
- Modify: `FONUS-CEBU/src/app/(marketing)/page.tsx` (add the new sections)

**Step 1: Update siteData.ts**
Add a list of common FAQs (Transferable, etc.) and placeholders for 3 testimonials.

**Step 2: Implement FAQ.tsx**
Use DaisyUI's "Collapse" (accordion) for the list of FAQs.

**Step 3: Implement Testimonials.tsx**
Create a grid of 3 cards for the member stories.

**Step 4: Update Home Page**
Include `<FAQ />` and `<Testimonials />` sections before the Contact section.

---

### Task 4: Visual Polish - Scroll Animations

**Files:**
- Modify: `FONUS-CEBU/package.json` (add `framer-motion`)
- Create: `FONUS-CEBU/src/components/Reveal.tsx` (Reusable animation wrapper)
- Modify: All marketing components to wrap their content in `<Reveal />`

**Step 1: Install Dependencies**
`npm install framer-motion`

**Step 2: Create Reveal.tsx**
A client component that uses `useInView` and `motion` to animate children.

**Step 3: Apply Animations**
Wrap sections in `Hero`, `Offers`, `Services`, `Programs`, `Benefits`, `About`, `Values`, and `Contact` with `<Reveal />`.

---
