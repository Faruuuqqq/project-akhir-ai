# MammoAI — Arsitektur Model

## Ringkasan

Model deteksi kanker payudara berbasis **EfficientNet-B4** yang dimodifikasi dengan custom classification head. Input berupa citra mammogram RGB 512×512, output berupa logit tunggal yang dikonversi ke probabilitas keganasan (0–1) melalui fungsi sigmoid.

- **Total parameter:** 18,59 juta (18.587.546)
- **Ukuran file:** ~71 MB (float32)
- **Input:** 3 channel × 512 × 512 piksel (RGB)
- **Output:** 1 scalar (logit → sigmoid → probabilitas)
- **Framework:** PyTorch

## Arsitektur

### Stem (Blok 0)

| Layer | Detail | Output Shape |
|-------|--------|-------------|
| Conv2D | 3→48, kernel 3×3, stride 2, padding 1 | 48 × 256 × 256 |
| BatchNorm2D | 48 channel | 48 × 256 × 256 |
| SiLU | Aktivasi | 48 × 256 × 256 |

### MBConv Blocks (Blok 1–7)

Setiap blok MBConv (Mobile Inverted Bottleneck Conv) terdiri dari:

```
Expansion Conv 1×1 → BN → SiLU        (hanya jika expand_ratio > 1)
Depthwise Conv 3×3/5×5 → BN → SiLU
SE Block (Global Avg Pool → FC → SiLU → FC → Sigmoid) → Scale
Projection Conv 1×1 → BN              (tanpa aktivasi)
Residual Add                           (hanya jika in_ch == out_ch dan stride == 1)
```

#### Blok 1: 48 → 24
| Sub-blok | kernel | stride | expand | SE dim | Output ch |
|----------|--------|--------|--------|--------|-----------|
| 0 | 3×3 | 1 | — | 12 | 24 |
| 1 | 3×3 | 1 | 24 | 6 | 24 |

#### Blok 2: 24 → 32
| Sub-blok | kernel | stride | expand | SE dim | Output ch |
|----------|--------|--------|--------|--------|-----------|
| 0 | 3×3 | 2 | 144 | 6 | 32 |
| 1–3 | 3×3 | 1 | 192 | 8 | 32 |

#### Blok 3: 32 → 56
| Sub-blok | kernel | stride | expand | SE dim | Output ch |
|----------|--------|--------|--------|--------|-----------|
| 0 | 5×5 | 2 | 192 | 8 | 56 |
| 1–3 | 5×5 | 1 | 336 | 14 | 56 |

#### Blok 4: 56 → 112
| Sub-blok | kernel | stride | expand | SE dim | Output ch |
|----------|--------|--------|--------|--------|-----------|
| 0 | 3×3 | 2 | 336 | 14 | 112 |
| 1–5 | 3×3 | 1 | 672 | 28 | 112 |

#### Blok 5: 112 → 160
| Sub-blok | kernel | stride | expand | SE dim | Output ch |
|----------|--------|--------|--------|--------|-----------|
| 0 | 5×5 | 2 | 672 | 28 | 160 |
| 1–5 | 5×5 | 1 | 960 | 40 | 160 |

#### Blok 6: 160 → 272
| Sub-blok | kernel | stride | expand | SE dim | Output ch |
|----------|--------|--------|--------|--------|-----------|
| 0 | 5×5 | 2 | 960 | 40 | 272 |
| 1–7 | 5×5 | 1 | 1632 | 68 | 272 |

#### Blok 7: 272 → 448
| Sub-blok | kernel | stride | expand | SE dim | Output ch |
|----------|--------|--------|--------|--------|-----------|
| 0 | 3×3 | 2 | 1632 | 68 | 448 |
| 1 | 3×3 | 1 | 2688 | 112 | 448 |

### Final Conv (Blok 8)

| Layer | Detail | Output Shape |
|-------|--------|-------------|
| Conv2D | 448→1792, kernel 1×1 | 1792 × 8 × 8 |
| BatchNorm2D | 1792 channel | 1792 × 8 × 8 |
| SiLU | Aktivasi | 1792 × 8 × 8 |

### Classification Head

```
AdaptiveAvgPool2d(1)          → 1792 × 1 × 1
Flatten                        → 1792
Linear(1792, 512)              → 512
BatchNorm1d(512)
SiLU
Dropout(0.2)
Linear(512, 1)                 → 1 (logit)
```

### Squeeze-and-Excitation (SE) Block

```
Global Avg Pool (per channel) → (C × 1 × 1)
FC(C → C/r)                    → (C/r)
SiLU
FC(C/r → C)                    → (C)
Sigmoid
Scale: x * s                   → (C × H × W)
```

Dimana `r` adalah rasio reduksi (SE dim), yang bervariasi per blok.

## Preprocessing Pipeline

1. Baca file DICOM (`pydicom.dcmread`)
2. Normalize piksel ke rentang 0–255 (min-max scaling)
3. Konversi grayscale ke RGB (`img.convert('RGB')`)
4. Resize ke 512×512
5. Konversi ke tensor (0–1)
6. Normalize: `(tensor - 0.5) / 0.5` → rentang -1 sampai 1

## Daftar Bobot Model (`state_dict`)

- Total key: 713
- Prefix: `backbone.features.X.Y.(block.Z.)?W`
- Tiap blok MBConv:
  - `block.0.*`: Expansion conv + BN
  - `block.1.*`: Depthwise conv + BN
  - `block.2.*`: SE block (fc1, fc2)
  - `block.3.*`: Projection conv + BN
- Head: `custom_head.1.*` (Linear), `custom_head.2.*` (BN), `custom_head.5.*` (Linear akhir)

## Catatan Penting

- Model menggunakan **SiLU** (Swish) sebagai aktivasi, bukan ReLU
- Tidak ada aktivasi setelah projection conv (hanya BN)
- Residual connection hanya aktif jika `in_ch == out_ch && stride == 1`
- Batch Normalization dalam mode eval (`running_mean`/`running_var` digunakan)
- Bobot disimpan dalam format float32 (~4 byte per parameter)
