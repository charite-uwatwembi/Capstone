import os
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib

# ── Configuration ───────────────────────────────────────────────────────────────
MODEL_DIR         = os.path.join(os.path.dirname(__file__), 'models')
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, 'soil_fertility_preprocessor.joblib')
MODEL_PATH        = os.path.join(MODEL_DIR, 'soil_fertility_rf_model.joblib')

# fixed default application rates (kg/ha) per label
DEFAULT_RATES = {
    "Add_Urea":             40,
    "Add_SSP":             170,
    "Add_Potash":           16,
    "Add_NK":               50,
    "Add_DAP":             100,
    "Add_NPK_17_17_17":    120,
    "No_Fertilizer_Needed":  0
}

# numeric feature names (must match your preprocessor)
NUMERIC_FEATURES = [
    "phoshorus(ppm)", "K(cmol/kg)", "TN", "OC",
    "CEC", "Sand", "Silt", "Clay", "MAP", "Elevation"
]
CATEGORICAL_FEATURE = "Crop_inter"
ALL_CROPS = [
    "Bean","Bean, climbing","Maize","Pea","Potato, Irish",
    "Potato, sweet","Rice, lowand","Rice, lowland",
    "Sorghum","Soybean","Wheat"
]

# ── Load model & preprocessor ─────────────────────────────────────────────────
preprocessor = joblib.load(PREPROCESSOR_PATH)
model        = joblib.load(MODEL_PATH)

# ── Flask setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)


def predict_sample(sample: dict):
    """Run through preprocessor→model→rate mapping."""
    df = pd.DataFrame([sample])
    X  = preprocessor.transform(df)
    lbl = model.predict(X)[0]
    return lbl, DEFAULT_RATES.get(lbl, 0)


@app.route('/api/predict', methods=['POST'])
def api_predict():
    """
    Expects JSON like:
    {
      "phoshorus(ppm)": 3.47,
      "K(cmol/kg)": 0.356,
      "TN": 1.72,
      "OC": 27,
      "CEC": 13,
      "Sand": 41,
      "Silt": 18,
      "Clay": 41,
      "MAP": 1241.63,
      "Elevation": 1673,
      "Crop_inter": "Maize"
    }
    """
    sample = request.get_json()
    if not sample:
        return jsonify({"error": "Invalid or missing JSON"}), 400

    try:
        label, rate = predict_sample(sample)
        return jsonify({
            "sample": sample,
            "label": label,
            "rate_kg_ha": rate
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/simulate', methods=['GET'])
def api_simulate():
    """
    Generates a random soil sample within plausible ranges,
    predicts on it, and returns both the sensor reading + prediction.
    """
    # random within realistic bounds
    sample = {
        "phoshorus(ppm)": round(random.uniform(1, 10), 2),
        "K(cmol/kg)":      round(random.uniform(0.1, 1.0), 3),
        "TN":              round(random.uniform(0.5, 3.0), 2),
        "OC":              round(random.uniform(5, 40), 1),
        "CEC":             round(random.uniform(5, 30), 1),
        "Sand":            round(random.uniform(10, 60), 1),
        "Silt":            round(random.uniform(5, 40), 1),
        "Clay":            round(random.uniform(10, 50), 1),
        "MAP":             round(random.uniform(800, 1600), 2),
        "Elevation":       round(random.uniform(1000, 2000), 1),
        "Crop_inter":      random.choice(ALL_CROPS)
    }

    label, rate = predict_sample(sample)
    return jsonify({
        "sample": sample,
        "label": label,
        "rate_kg_ha": rate
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
