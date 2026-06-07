# DESIGN.md — RSNA Mammography AI

## Brand
- Name: RSNA Mammography AI (or custom name)
- Identity: A state-of-the-art modern radiology clinic. Scientific precision meets human empathy. Clean, sterile, but deeply comforting and trustworthy.
- Personality: Professional, precise, calming, transparent.
- Tone: Empathetic but clinical. No hype, no exclamation points. State facts clearly. Never use panic-inducing language.

## Colors
- Background: Clinical Pearl #FAFAFA (softer than pure white, reduces eye strain)
- Surface: Pure White #FFFFFF
- Surface Dark: MRI Black #121417 (used strictly for the DICOM image viewer area to maximize contrast)
- Text Primary: Charcoal #1F2937
- Text Secondary: Slate #64748B
- Accent Primary: Trust Teal #0F766E (calming, medical, authoritative)
- Accent Hover: Teal Dark #0F5F59
- Accent Dim: rgba(15,118,110,0.06)
- Semantic Negative (Normal): Calm Blue #3B82F6 (do not use bright green, use blue for "clear/normal" to feel clinical)
- Semantic Positive (Cancer Detected): Muted Rose #BE123C (serious, alert, but not a neon "panic" red)
- Warning/Disclaimer: Warm Amber #D97706
- Border: Light Silver #E2E8F0

## Typography
- Headings: Plus Jakarta Sans 600, tracking -0.02em (clean, geometric, highly legible)
- Body: Inter 400, 15px, line-height 1.6
- Data/Probabilities: JetBrains Mono 500, tabular-nums (crucial for showing the exact AI confidence scores and pF1 metrics)
- Labels: Inter 500, 12px, uppercase, tracking 0.05em, Slate color
- Disclaimer Text: Inter 400 italic, 12px, Slate color

## Spacing
- Hero/Header padding: 80px vertical
- Section padding: 64px vertical
- Card padding: 32px (generous breathing room to reduce cognitive load)
- Grid gap: 24px
- Base unit: 8px

## Visual Texture
- NO generic noise or gradient blobs (Anti-slop rule).
- Topographical/Contour lines: Subtle SVG background in the hero section resembling mammogram tissue density lines (1px stroke, #E2E8F0 at 40% opacity).
- Glassmorphism: Minimal. Only used for floating action bars over the dark DICOM viewer.

## Custom SVG Language
- Stroke width: 1.5px
- Stroke linecap: round
- Color: Slate #64748B (default), Trust Teal #0F766E (active)
- Style: Technical but rounded. Medical crosses, anatomical outlines, neural network nodes.
- Required SVGs: Upload cloud, DICOM file icon, AI scanning nodes, Info tooltip (question mark in a circle).

## Buttons
- Primary (Upload/Scan): Trust Teal #0F766E background, White text. Subtle shadow: 0 4px 14px rgba(15,118,110,0.25). On hover: translateY(-1px), shadow expands to 20px blur. Smooth 250ms transition. 
- Secondary: Pure White bg, 1px Light Silver border, Charcoal text. On hover: background shifts to Clinical Pearl.
- Disabled (Processing): Slate #64748B at 50% opacity, no pointer events. Wait for AI processing to finish.
- Corner Radius: 8px (structured but not aggressively sharp).

## Cards & Containers
- Layout Cards: Pure White #FFFFFF
- Border: 1px solid #E2E8F0
- Radius: 16px (soft, approachable)
- Shadow: 0 4px 20px rgba(0,0,0,0.03) — very subtle, just enough for depth.
- DICOM Viewer Container: MRI Black #121417 background, 0px radius (sharp corners for medical imagery), no borders. Image is centered.

## Data & Results Display (CRITICAL)
- Probability Score: Massive text (e.g., 64px) using JetBrains Mono. If < 50%, color is Calm Blue. If > 50%, color is Muted Rose.
- Confidence Bar: A horizontal progress bar under the score. Fills from left to right.
- AI Explanation Box: A secondary card below the score detailing "What this means". Must include a subtle Warm Amber left-border for the medical disclaimer.

## Interactive Elements & Empty States
- Upload Area (Empty State): Large dashed border (#CBD5E1), light Teal background tint on drag-over. Clear specific copy: "Drop .dcm or .png mammogram here".
- Loading State: DO NOT use a generic spinning circle. Use a scanning line moving top-to-bottom over a placeholder breast outline, with text: "AI is analyzing tissue density...".
- Tooltips: Essential for medical apps. Use on hover over terms like "Probabilistic F1" or "Malignant". Dark background, white text, 6px radius.

## Anti-Slop Rules (Strict Constraints)
- 1. NO placeholder text ("Lorem Ipsum"). Use realistic medical copy (e.g., "Patient ID: 10459", "View: Craniocaudal (CC)").
- 2. NO stock photos of smiling doctors pointing at laptops. Use abstract AI node graphics or high-fidelity UI mockups.
- 3. Medical Disclaimer is MANDATORY and must be visible without scrolling on the results page.
- 4. The UI must never state "You have cancer". It must state "AI Probability of Malignancy: X%". Tone matters.
- 5. Max content width is 1024px. Keep the reading line lengths comfortable.