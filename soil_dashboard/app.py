# app.py

import os
import json
import random
import numpy as np
import pandas as pd

from flask import Flask, render_template, jsonify, request
import joblib

app = Flask(__name__)

# ----------------------------------
# 1. Load the preprocessor & model
# ----------------------------------

# Adjust paths if needed
PREPROCESSOR_PATH = os.path.join("models", "soil_fertility_preprocessor.joblib")
MODEL_PATH = os.path.join("models", "soil_fertility_rf_model.joblib")

preprocessor = joblib.load(PREPROCESSOR_PATH)
model = joblib.load(MODEL_PATH)

# Default rates mapping (fixed kg/ha)
DEFAULT_RATES = {
    "Add_Urea": 40,
    "Add_SSP": 170,
    "Add_Potash": 16,
    "Add_NK": 50,
    "Add_DAP": 100,
    "Add_NPK_17_17_17": 120,
    "No_Fertilizer_Needed": 0
}

# Example numeric feature names
NUMERIC_FEATURES = ["phoshorus(ppm)", "K(cmol/kg)", "TN", "OC", "CEC",
                    "Sand", "Silt", "Clay", "MAP", "Elevation"]

# Example crop categories (must match training one-hot encoder categories)
CROP_CATEGORIES = [
    "Bean", "climbing Bean", "Maize", "Pea", "Potato, Irish",
    "Potato, sweet", "Rice, lowand", "Rice, lowland", "Sorghum",
    "Soybean", "Wheat"
]

# --------------------------------------------------------
# 2. Helper: Simulate or load a single/new soil sample
# --------------------------------------------------------
def get_latest_sample():
    """
    Simulate a new sample by picking random values within realistic ranges.
    In a real deployment, you'd read from actual sensors or a database.
    """
    sample = {
        "phoshorus(ppm)": round(random.uniform(2.5, 10.0), 2),
        "K(cmol/kg)": round(random.uniform(0.1, 0.6), 3),
        "TN": round(random.uniform(0.05, 0.3), 3),
        "OC": round(random.uniform(1.0, 3.0), 2),
        "CEC": round(random.uniform(10, 20), 1),
        "Sand": round(random.uniform(20, 60), 1),
        "Silt": round(random.uniform(15, 50), 1),
        "Clay": round(random.uniform(10, 40), 1),
        "MAP": round(random.uniform(800, 1400), 2),
        "Elevation": round(random.uniform(1400, 1800), 1),
        # Randomly pick a crop from the known categories
        "Crop_inter": random.choice(CROP_CATEGORIES)
    }
    return sample


# --------------------------------------------------------
# 3. Home route: Serve the dashboard page
# --------------------------------------------------------
@app.route("/")
def index():
    """
    Render the main dashboard (index.html).
    """
    return render_template("index.html")


# --------------------------------------------------------
# 4. API route: /api/predictions
#   - mode=batch: return hold‐out test set predictions
#   - default: return a single “latest” sample prediction
# --------------------------------------------------------
@app.route("/api/predictions")
def api_predictions():
    mode = request.args.get("mode", default="single", type=str)

    # -----------------------------
    # 4a. Single‐sample mode
    # -----------------------------
    if mode != "batch":
        sample = get_latest_sample()
        sample_df = pd.DataFrame([sample])
        X_new = preprocessor.transform(sample_df)
        pred_label = model.predict(X_new)[0]
        rate = DEFAULT_RATES.get(pred_label, 0)

        result = {
            "input": sample,
            "prediction": {
                "fertilizer_label": pred_label,
                "rate_kg_ha": rate
            }
        }
        return jsonify(result)

    # -----------------------------
    # 4b. Batch hold‐out mode
    # -----------------------------
    else:
        # Assume you saved a hold-out CSV named "holdout_data.csv" with features + true labels
        # For demo, we generate a small dummy DataFrame:
        # Replace this block with actual hold‐out data loading if available.
        data = []
        for _ in range(10):
            s = get_latest_sample()
            # pretend we know the true fertilizer label (randomly choose for demo)
            true_label = random.choice(list(DEFAULT_RATES.keys()))
            s["True_Label"] = true_label
            data.append(s)
        df_holdout = pd.DataFrame(data)

        # Preprocess & predict
        X_holdout = preprocessor.transform(df_holdout[NUMERIC_FEATURES + ["Crop_inter"]])
        preds = model.predict(X_holdout)

        # Build JSON list
        results = []
        for idx, row in df_holdout.iterrows():
            label_pred = preds[idx]
            rate_pred = DEFAULT_RATES.get(label_pred, 0)
            results.append({
                "phoshorus(ppm)": row["phoshorus(ppm)"],
                "K(cmol/kg)": row["K(cmol/kg)"],
                "TN": row["TN"],
                "OC": row["OC"],
                "CEC": row["CEC"],
                "Sand": row["Sand"],
                "Silt": row["Silt"],
                "Clay": row["Clay"],
                "MAP": row["MAP"],
                "Elevation": row["Elevation"],
                "Crop_inter": row["Crop_inter"],
                "True_Label": row["True_Label"],
                "Pred_Label": label_pred,
                "Rate_kg_ha": rate_pred
            })

        return jsonify(results)


# --------------------------------------------------------
# 5. Run the Flask app
# --------------------------------------------------------
if __name__ == "__main__":
    # On development, use debug=True
    app.run(host="0.0.0.0", port=5000, debug=True)
