import random

FINDING_TEMPLATES = [
    {
        "type": "Massa",
        "locations": ["Kuadran Atas Luar", "Kuadran Atas Dalam", "Kuadran Bawah Luar", "Kuadran Bawah Dalam", "Sentral", "Retroareolar"],
        "benign_shapes": ["Oval", "Bulat", "Makrolobulasi"],
        "benign_margins": ["Sirkumskrip", "Mikrolobulasi"],
        "benign_density": ["Rendah", "Equal"],
        "suspicious_shapes": ["Irreguler", "Spikulasi"],
        "suspicious_margins": ["Spikulasi", "Indistinct"],
        "suspicious_density": ["Tinggi"],
    },
    {
        "type": "Kalsifikasi",
        "locations": ["Kuadran Atas Luar", "Kuadran Atas Dalam", "Regional", "Segmentral", "Linier"],
        "benign_morph": ["Punktat", "Amorf", "Kasar"],
        "benign_dist": ["Diffus", "Regional"],
        "suspicious_morph": ["Pleomorfik Halus", "Kalsifikasi Linier Halus"],
        "suspicious_dist": ["Agregat", "Segmentral", "Linier"],
    },
    {
        "type": "Asimetri",
        "locations": ["Kuadran Atas Luar", "Kuadran Atas Dalam", "Kuadran Bawah Luar", "Diffus"],
        "benign_shapes": ["Fokal"],
        "suspicious_shapes": ["Global", "Fokal Progresif"],
    },
    {
        "type": "Distorsi Arsitektur",
        "locations": ["Kuadran Atas Luar", "Kuadran Atas Dalam", "Sentral", "Retroareolar"],
        "benign_shapes": [],
        "suspicious_shapes": ["Distorsi fokal", "Distorsi dengan spikulasi"],
    },
]


def _pick_random(lst):
    return lst[random.randint(0, len(lst) - 1)] if lst else ""


def _generate_findings(probability: float) -> list[dict]:
    random.seed(int(probability * 10000))
    findings = []

    if probability < 0.05:
        return findings

    if probability < 0.35:
        template = FINDING_TEMPLATES[1]
        findings.append({
            "type": template["type"],
            "location": _pick_random(template["locations"]),
            "side": "L",
            "characteristics": [_pick_random(template["benign_morph"]), _pick_random(template["benign_dist"])],
            "sizeMm": None,
            "biRadsAssessment": "BI-RADS 2",
        })
        return findings

    if probability < 0.50:
        template = FINDING_TEMPLATES[0]
        findings.append({
            "type": template["type"],
            "location": _pick_random(template["locations"]),
            "side": random.choice(["L", "R"]),
            "characteristics": [
                _pick_random(template["benign_shapes"]),
                _pick_random(template["benign_margins"]),
                _pick_random(template["benign_density"]),
            ],
            "sizeMm": random.randint(5, 18),
            "biRadsAssessment": "BI-RADS 3",
        })
        return findings

    if probability < 0.85:
        template = FINDING_TEMPLATES[0]
        findings.append({
            "type": template["type"],
            "location": _pick_random(template["locations"]),
            "side": random.choice(["L", "R"]),
            "characteristics": [
                _pick_random(template["suspicious_shapes"]),
                _pick_random(template["suspicious_margins"]),
                _pick_random(template["suspicious_density"]),
            ],
            "sizeMm": random.randint(10, 35),
            "biRadsAssessment": "BI-RADS 4",
        })
        template2 = FINDING_TEMPLATES[1]
        findings.append({
            "type": template2["type"],
            "location": _pick_random(template2["locations"]),
            "side": findings[0]["side"],
            "characteristics": [
                _pick_random(template2["suspicious_morph"]),
                _pick_random(template2["suspicious_dist"]),
            ],
            "sizeMm": None,
            "biRadsAssessment": "BI-RADS 4",
        })
        return findings

    template = FINDING_TEMPLATES[3]
    findings.append({
        "type": template["type"],
        "location": _pick_random(template["locations"]),
        "side": random.choice(["L", "R"]),
        "characteristics": [_pick_random(template["suspicious_shapes"])] if template["suspicious_shapes"] else [],
        "sizeMm": None,
        "biRadsAssessment": "BI-RADS 5",
    })
    template2 = FINDING_TEMPLATES[0]
    findings.append({
        "type": template2["type"],
        "location": _pick_random(template2["locations"]),
        "side": findings[0]["side"],
        "characteristics": [
            _pick_random(template2["suspicious_shapes"]),
            _pick_random(template2["suspicious_margins"]),
            _pick_random(template2["suspicious_density"]),
        ],
        "sizeMm": random.randint(20, 55),
        "biRadsAssessment": "BI-RADS 5",
    })
    return findings


def _generate_impression(probability: float) -> str:
    if probability < 0.02:
        return "Payudara negatif untuk proses keganasan. Tidak ditemukan massa, kalsifikasi patologis, atau distorsi arsitektur."
    if probability < 0.10:
        return "Temuan jinak terdeteksi. Tidak ada bukti radiologis yang mendukung proses keganasan."
    if probability < 0.50:
        return "Temuan dengan probabilitas rendah untuk keganasan. Disarankan evaluasi ulang dalam interval jangka pendek."
    if probability < 0.85:
        return "Temuan mencurigakan terdeteksi. Probabilitas keganasan moderat hingga tinggi. Korelasi klinis dan konfirmasi histopatologis direkomendasikan."
    return "Temuan sangat sugestif untuk keganasan. Tindakan biopsi diagnostik dan konsultasi bedah onkologi segera diperlukan."


BREAST_COMPOSITIONS = [
    "Hampir seluruhnya lemak (A)",
    "Kepadatan fibroglandular tersebar (B)",
    "Padat secara heterogen (C)",
    "Sangat padat (D)",
]


def determine_birads(probability: float) -> dict:
    if probability < 0.02:
        return {
            "category": "BI-RADS 1",
            "description": "Negatif — tidak ada temuan abnormal",
            "recommendation": "Skrining rutin tahunan"
        }
    elif probability < 0.10:
        return {
            "category": "BI-RADS 2",
            "description": "Jinak (Benign) — tidak terdeteksi malignansi",
            "recommendation": "Tindak lanjut rutin"
        }
    elif probability < 0.50:
        return {
            "category": "BI-RADS 3",
            "description": "Kemungkinan jinak — risiko malignansi rendah",
            "recommendation": "Tindak lanjut jangka pendek (6 bulan)"
        }
    elif probability < 0.95:
        return {
            "category": "BI-RADS 4",
            "description": "Abnormalitas mencurigakan — indikasi malignansi",
            "recommendation": "Pemeriksaan lanjutan via USG / biopsi disarankan"
        }
    else:
        return {
            "category": "BI-RADS 5",
            "description": "Sangat sugestif malignansi",
            "recommendation": "Segera lakukan tindakan biopsi diagnostik"
        }


def generate_explanation(bi_rads: dict, probability: float) -> str:
    explanations = {
        "BI-RADS 1": "Tidak terdeteksi anomali. Struktur jaringan konsisten dengan kepadatan payudara normal. Pasien disarankan melanjutkan skrining rutin sesuai usia.",
        "BI-RADS 2": "Terdapat temuan jinak (contoh: kista sederhana, fibroadenoma jinak, kalsifikasi makro) tanpa tanda keganasan. Tindak lanjut rutin direkomendasikan.",
        "BI-RADS 3": "Citra menunjukkan temuan dengan kemungkinan jinak tinggi. Namun disarankan pemeriksaan ulang (surveillance) dalam 6 bulan untuk mengamati stabilitas temuan.",
        "BI-RADS 4": "Model AI mendeteksi topologi yang mencurigakan dengan indikasi probabilitas malignansi moderat hingga tinggi. Evaluasi sonografi klinis dan/atau biopsi jaringan disarankan.",
        "BI-RADS 5": "Pola kepadatan jaringan sangat sugestif terhadap karsinoma invasif atau indikasi malignansi tingkat tinggi. Tindakan biopsi diagnostik darurat wajib dilakukan."
    }
    return explanations.get(bi_rads["category"], "Gagal memproses analisis penjelasan.")


def generate_findings(probability: float, breast_density: str | None = None) -> dict:
    findings = _generate_findings(probability)
    if breast_density and breast_density in ("A", "B", "C", "D"):
        composition_index = {"A": 0, "B": 1, "C": 2, "D": 3}[breast_density]
        composition = BREAST_COMPOSITIONS[composition_index]
    else:
        composition = "Tidak tersedia"
    return {
        "findings": findings,
        "breastComposition": composition,
        "impression": _generate_impression(probability),
    }
