# DESIGN.md — RSNA Mammography AI

> **Catatan:** Dokumen ini mencerminkan design system yang **aktual** di codebase, bukan spesifikasi ideal. Jika ada perbedaan antara dokumentasi dan kode, kode adalah sumber kebenaran.

## Brand DNA

- **Identity:** Klinik radiologi modern. Presisi ilmiah bertemu empati manusia. Bersih, steril, tapi menenangkan dan terpercaya.
- **Personality:** Profesional, presisi, kalem, transparan.
- **Tone:** Empatis namun klinis. Tidak ada hype, tidak ada tanda seru. Nyatakan fakta dengan jelas. Jangan pernah menggunakan bahasa yang memicu kepanikan.

## Color System

### Palette Kustom

| Token | Hex | Tailwind Class | Penggunaan |
|-------|-----|----------------|------------|
| `clinical-pearl` | `#FAFAFA` | `bg-clinical-pearl` | Latar halaman |
| (white) | `#FFFFFF` | `bg-white` | Surface cards, modal |
| `mri-black` | `#121417` | `bg-mri-black` | Latar DICOM viewer |
| `charcoal` | `#1F2937` | `text-charcoal` | Teks utama (heading, body) |
| `slate` | `#64748B` | `text-slate`, `bg-slate` | Teks sekunder, label |
| `trust-teal` | `#0F766E` | `text-trust-teal`, `bg-trust-teal`, `border-trust-teal` | Aksen utama — tombol, link aktif, badge, progress bar |
| `teal-dark` | `#0F5F59` | `bg-teal-dark` | Hover state tombol |
| `calm-blue` | `#3B82F6` | `text-calm-blue`, `bg-calm-blue/10` | Probabilitas rendah / normal |
| `muted-rose` | `#BE123C` | `text-muted-rose`, `bg-muted-rose` | Probabilitas tinggi / alert |
| `warm-amber` | `#D97706` | `text-warm-amber`, `border-warm-amber` | Disclaimer, warning |
| `light-silver` | `#E2E8F0` | `border-light-silver`, `bg-light-silver` | Border, skeleton loading |

### Aturan Warna Semantik

- **Low probability / Normal:** `calm-blue` (#3B82F6) — bukan hijau terang
- **High probability / Indication:** `muted-rose` (#BE123C) — merah serius, bukan neon panic-red
- **Disclaimer / Warning:** `warm-amber` (#D97706) — border kiri atau background tipis
- **Error state:** `muted-rose` untuk border dan teks, background `bg-red-50` (Tailwind stock, belum dimigrasi ke kustom)

## Typography

### Font Stack (via `next/font/google` + CSS)

| Font | CSS Variable | Weight | Penggunaan |
|------|-------------|--------|------------|
| **Plus Jakarta Sans** | `--font-jakarta` | 400, 500, 600, 700 | Semua heading, brand name, label, badge |
| **Inter** | `--font-inter` | 400, 500 | Body text, navigasi, button, paragraf |
| **JetBrains Mono** | `--font-mono` | 400, 500 | Data numerik — probabilitas, BI-RADS, timestamp, patient ID |

### Spesifikasi per Elemen

| Elemen | Font | Size | Weight | Letter-spacing | Lainnya |
|--------|------|------|--------|----------------|---------|
| Hero h1 | Jakarta | `5xl md:6xl` | bold | `tracking-tight` | `leading-[1.1]` |
| Section h2 | Jakarta | `3xl` atau `4xl` | bold | — | — |
| Section h3 | Jakarta | `xl` | bold | — | — |
| Sub-heading | Jakarta | `text-sm` | semibold | `uppercase tracking-[0.1em]` | Warna `text-slate` |
| Body text | Inter | `text-base` (16px) | normal | — | `leading-relaxed` |
| Label | Jakarta | `text-[10px]` atau `text-xs` | bold | `uppercase tracking-[0.15em]` | Warna `text-slate` |
| Probability score | Mono | `5xl` (48px) atau `[5rem]` (80px) | medium | `tracking-tight` | `leading-none` |
| Disclaimer | Inter | `text-xs` | italic | — | `text-slate` |
| Default body | Inter | 16px | 400 | — | `line-height: 1.6` |
| Default heading | Jakarta | varies | 600 | `-0.02em` | (dari globals.css) |

## Spacing

- **Hero padding:** `pt-32 pb-24 px-6` (128px top, 96px bottom)
- **Section padding:** `py-24 px-6` (96px vertical)
- **Card padding:** `p-8` (32px)
- **Grid gap:** `gap-6` (24px)
- **Base unit:** 8px (semua spacing adalah kelipatan 8)
- **Max content width:** `max-w-6xl` (1152px)
- **Konten sempit:** `max-w-4xl` (896px) — research page
- **Upload zone sempit:** `max-w-md` (448px) — saat kosong

## Border Radius

| Token | Value | Penggunaan |
|-------|-------|------------|
| `rounded-2xl` | **16px** | Cards utama (UploadZone, ResultsCard, MetadataCard, disclaimer, modal, feature cards) |
| `rounded-xl` | **12px** | Icon container, pipeline cards |
| `rounded-lg` | **8px** | Tombol, metadata row, skeleton, DICOM viewer container, error banner |
| `rounded-md` | **6px** | Metadata row hover group |
| `rounded-sm` | **2px** | Focus-visible outline |
| `rounded-full` | **50%** | Badge, pill, progress bar, status dot |

## Shadows

| Token | Value | Tailwind | Penggunaan |
|-------|-------|----------|------------|
| `medical` | `0 4px 20px rgba(0,0,0,0.03)` | `shadow-medical` | Default card shadow |
| `teal-glow` | `0 4px 14px rgba(15,118,110,0.25)` | `shadow-teal-glow` | Tombol primary, hover card |
| `teal-glow-hover` | `0 8px 20px rgba(15,118,110,0.3)` | `shadow-teal-glow-hover` | Tombol primary hover |
| `shadow-sm` | Tailwind default | `shadow-sm` | Navbar, footer, pipeline cards |
| `shadow-inner` | Tailwind default | `shadow-inner` | Confidence bar track |

## Buttons

### Primary (CTA)
```
bg-trust-teal text-white px-8 py-4 rounded-lg font-semibold
shadow-teal-glow
hover:bg-teal-dark hover:shadow-teal-glow-hover hover:-translate-y-1
transition-all
whileTap: scale-98 (Framer Motion spring)
```

### Secondary
```
border border-light-silver bg-white text-charcoal px-8 py-4 rounded-lg font-semibold
hover:bg-clinical-pearl
transition-all
```

### Disabled (Processing)
```
opacity-50 cursor-not-allowed bg-slate/50 text-white/70
```

### Variant Ukuran
- **Default:** `px-8 py-4` (tombol utama di landing/screening)
- **Compact:** `px-4 py-2 text-sm` (navbar)
- **Compact medium:** `px-4 py-3` (upload/analyze)

## Cards & Containers

### Standar Card
```html
className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical"
```

### Hover Variant
```html
hover:shadow-teal-glow hover:border-trust-teal/30 transition-all
```

### Accent Border
- **Left border warning:** `border-l-4 border-warm-amber` (disclaimer, peringatan)
- **Left border error:** `border-l-4 border-muted-rose` (error alerts)
- **Left border info:** `border-l-4 border-trust-teal` (rekomendasi, info box)

### Skeleton Loading
```
bg-light-silver rounded animate-pulse
```
Container: `rounded-2xl border border-light-silver bg-white p-8 shadow-medical space-y-4`

### DICOM Viewer Container
```
bg-mri-black rounded-lg overflow-hidden
```
Image di-center dengan `object-contain`. Tidak ada border. Overlay loading dengan `bg-black bg-opacity-40`.

## Animations (Framer Motion)

| Elemen | Animasi | Durasi | Timing |
|--------|---------|--------|--------|
| Page entrance | Fade in + slide up (y: 20/30) | 0.6s–0.8s | `easeOut` |
| Hero visual | Fade in + scale | 0.8s + 0.2s delay | `easeOut` |
| Feature cards | Fade + slide up via `whileInView` | 0.7s | default |
| Button hover | `transition-all` (transform, shadow, bg) | 300ms | ease |
| Button click | `whileTap: scale=0.98` | spring `300, 20` | spring |
| Upload zone drag | `scale: 1.03` | spring `300, 20` | spring |
| Nav indicator | Layout animation | spring `300, 30` | spring |
| Scanning line | Vertical sweep top-to-bottom | 2.5s repeat | `linear` |
| Results stagger | Stagger children 0.08s | 0.4s each | `[0.22, 1, 0.36, 1]` |
| Confidence bar fill | Width 0 → target | 1.5s | `[0.22, 1, 0.36, 1]` |
| Heatmap fade | Opacity 0 → 0.6 | 1.5s | `easeOut` |

## Icon System

- **Library:** Material Symbols Outlined (Google Fonts CDN)
- **Size:** `text-base`, `text-sm`, `text-2xl`, `text-3xl`, `text-[48px]`
- **Warna:** Mengikuti `text-*` utility classes
- **Icon yang digunakan:** `biotech`, `verified`, `neurology`, `speed`, `fact_check`, `cloud_upload`, `analytics`, `warning`, `error`, `arrow_forward`, `close`

## Visual Texture

- **NO** generic noise atau gradient blobs
- **NO** stock photos
- **Subtle SVG contours** di hero section — topographical lines menyerupai jaringan mammogram (stroke `#E2E8F0`, opacity 40%)
- **Glassmorphism** minimal — hanya untuk floating bar di atas DICOM viewer jika diperlukan

## Data & Results Display

- **Probability Score:** `text-[5rem]` (80px) dengan JetBrains Mono, warna `calm-blue` jika < 50%, `muted-rose` jika ≥ 50%
- **Confidence Bar:** Horizontal progress bar di bawah score, fill dari kiri ke kanan (1.5s animasi)
- **AI Explanation Box:** Kartu sekunder dengan `border-l-4 border-warm-amber`, menjelaskan arti hasil
- **Medical Disclaimer:** `text-xs italic text-slate` dengan `border-l-4 border-warm-amber`, **WAJIB** terlihat tanpa scroll di halaman hasil

## States & Interaksi

### Upload Area
- **Idle:** `border-2 border-dashed border-light-silver`
- **Drag-over:** Background tint teal tipis (`bg-trust-teal/5`), scale 1.03
- **Copy:** "Letakkan file .dcm atau .png mammogram di sini"

### Loading State
- **Bukan** spinning circle generik
- Scanning line vertikal (gradien teal) bergerak top-to-bottom di atas placeholder payudara
- Teks: "AI sedang menganalisis jaringan mamografi..."

### Error State
- Background `bg-red-50`, border kiri `border-l-4` (seharusnya `border-muted-rose`, saat ini masih `border-red-500`)
- Auto-dismiss dalam 5 detik
- Icon `warning` atau `error` dari Material Symbols

### Empty State (Results)
- Skeleton shimmer (`animate-pulse`) dengan 3 baris + 1 persegi panjang
- Menunggu hasil analisis

## Anti-Slop Rules

1. **NO** placeholder text ("Lorem Ipsum"). Gunakan copy medis realistis dalam Bahasa Indonesia.
2. **NO** stock photos. Gunakan SVG abstrak atau Material Icons.
3. **Medical Disclaimer WAJIB** dan harus terlihat tanpa scroll di halaman hasil.
4. UI tidak boleh mengatakan "Anda terkena kanker". Harus: "Probabilitas Keganasan AI: X%".
5. **Max content width:** 1152px (`max-w-6xl`). Jaga panjang baris tetap nyaman dibaca.

## Catatan Migrasi

Komponen berikut masih menggunakan Tailwind stock colors dan perlu dimigrasi ke design tokens kustom:

| Komponen | Masalah |
|----------|---------|
| `ConsentModal.tsx` | `text-slate-900`, `text-slate-600`, `border-slate-200`, `bg-teal-700`, dll — juga masih berbahasa Inggris |
| `ErrorBoundary.tsx` | `bg-red-50`, `text-red-600`, `bg-red-600` — harusnya `muted-rose` |
| `screening/page.tsx` error banner | `border-red-500`, `bg-red-50`, `text-red-600` — harusnya `muted-rose` |
| `research/page.tsx` disclaimer | `bg-orange-50` — harusnya `bg-warm-amber/10` |
