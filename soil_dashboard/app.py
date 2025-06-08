from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# Paths to your saved preprocessor and model (inside the `models/` folder)
PREPROCESSOR_PATH = os.path.join("models", "soil_fertility_preprocessor.joblib")
MODEL_PATH = os.path.join("models", "soil_fertility_rf_model.joblib")

# Load preprocessor and model at startup
preprocessor = joblib.load(PREPROCESSOR_PATH)
model = joblib.load(MODEL_PATH)

# Default fertilizer application rates (kg/ha)
default_rates = {
    "Add_Urea": 40,
    "Add_SSP": 170,
    "Add_Potash": 16,
    "Add_NK": 50,
    "Add_DAP": 100,
    "Add_NPK_17_17_17": 120,
    "No_Fertilizer_Needed": 0
}

# For demonstration: a small batch of hold-out test data (you can replace with your own DataFrame)
# In practice, you'd load a CSV or database. Here we just simulate an empty batch.
# ---------------------------------------------------------------
# Example: 
# df_holdout = pd.read_csv("Data/holdout_test.csv")  
# X_holdout = preprocessor.transform(df_holdout[features_list])
# y_holdout = df_holdout["Fert_Label"]
# ---------------------------------------------------------------
df_holdout = pd.DataFrame()  # placeholder


@app.route("/")
def index():
    """
    Renders the 'Predict' page (the landing page).
    """
    return render_template("predict.html")


@app.route("/batch")
def batch():
    """
    Renders the 'Batch Predictions' page.
    """
    return render_template("batch.html")


@app.route("/profile")
def profile():
    """
    Renders a user 'Profile' page.
    """
    return render_template("profile.html")


@app.route("/agrinews")
def agrinews():
    """
    Renders a page that pulls in agriculture news for Rwanda (static/mockup in this demo).
    """
    return render_template("agrinews.html")


@app.route("/about")
def about():
    """
    Renders a simple 'About' page.
    """
    return render_template("about.html")


@app.route("/api/predict", methods=["POST"])
def api_predict():
    """
    Receives soil readings + crop from a JSON POST request (AJAX), returns JSON: { fertilizer_label, rate_kg_ha }.
    """
    data = request.json or {}
    # Expecting JSON keys: phosphorus, k, tn, oc, cec, sand, silt, clay, map, elevation, crop
    try:
        new_sample = {
            "phoshorus(ppm)": float(data.get("phosphorus", 0)),
            "K(cmol/kg)": float(data.get("k", 0)),
            "TN": float(data.get("tn", 0)),
            "OC": float(data.get("oc", 0)),
            "CEC": float(data.get("cec", 0)),
            "Sand": float(data.get("sand", 0)),
            "Silt": float(data.get("silt", 0)),
            "Clay": float(data.get("clay", 0)),
            "MAP": float(data.get("map", 0)),
            "Elevation": float(data.get("elevation", 0)),
            "Crop_inter": data.get("crop", "")
        }
        # Convert to DataFrame
        new_df = pd.DataFrame([new_sample])
        # Preprocess & predict
        X_new = preprocessor.transform(new_df)
        pred_label = model.predict(X_new)[0]
        rate = default_rates.get(pred_label, 0)

        return jsonify({
            "fertilizer": pred_label,
            "rate": rate,
            "input_data": new_sample
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/batch", methods=["GET"])
def api_batch():
    """
    Returns a (mock) hold-out batch of predictions as JSON.
    In practice, load a real DataFrame, preprocess, predict, and return a list of dicts.
    Here we simply return an empty list if no hold-out data is provided.
    """
    try:
        if df_holdout.empty:
            return jsonify({"batch": []})

        # Example hold-out processing (uncomment + adjust to your real columns):
        # Xh = preprocessor.transform(df_holdout[numeric_features + ["Crop_inter"]])
        # preds = model.predict(Xh)
        # rates = [default_rates[p] for p in preds]
        # df_holdout["Pred_Label"] = preds
        # df_holdout["Rate(kg/ha)"] = rates
        # result = df_holdout[["Crop_inter", "True_Label", "Pred_Label", "Rate(kg/ha)"]].to_dict(orient="records")
        # return jsonify({"batch": result})

        return jsonify({"batch": []})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
