def determine_birads(probability: float) -> dict:
    """Map probability to BI-RADS category."""
    if probability < 0.02:
        return {
            "category": "BI-RADS 1",
            "description": "Negative — no findings",
            "recommendation": "Routine screening"
        }
    elif probability < 0.10:
        return {
            "category": "BI-RADS 2",
            "description": "Benign — no malignancy detected",
            "recommendation": "Routine follow-up"
        }
    elif probability < 0.50:
        return {
            "category": "BI-RADS 3",
            "description": "Probably benign — low malignancy risk",
            "recommendation": "Short-term follow-up (6 months)"
        }
    elif probability < 0.95:
        return {
            "category": "BI-RADS 4",
            "description": "Suspicious abnormality — biopsy recommended",
            "recommendation": "Further workup with ultrasound or MRI"
        }
    else:
        return {
            "category": "BI-RADS 5",
            "description": "Highly suggestive of malignancy",
            "recommendation": "Immediate biopsy recommended"
        }

def generate_explanation(bi_rads: dict, probability: float) -> str:
    """Generate human-readable explanation based on BI-RADS and probability."""
    explanations = {
        "BI-RADS 1": "No abnormalities detected. Findings are consistent with normal tissue. Routine screening recommended.",
        "BI-RADS 2": "Findings consistent with benign lesions. No evidence of malignancy. Regular follow-up appropriate.",
        "BI-RADS 3": "Findings suggest probably benign lesion with low malignancy risk. Short-term surveillance with 6-month follow-up recommended to ensure stability.",
        "BI-RADS 4": "Suspicious abnormality detected. Pattern is suggestive of possible malignancy. Further diagnostic workup with ultrasound or MRI is recommended.",
        "BI-RADS 5": "Findings are highly suggestive of malignancy. Immediate diagnostic biopsy recommended."
    }
    
    return explanations.get(bi_rads["category"], "Unable to generate explanation.")