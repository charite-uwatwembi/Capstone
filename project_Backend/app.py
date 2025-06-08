from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, pandas as pd, numpy as np, random, time

app = Flask(__name__)
CORS(app)  # allow React dev server to call us

# load your trained objects
PREP = joblib.load("models/soil_fertility_preprocessor.joblib")
MODEL = joblib.load("models/soil_fertility_rf_model.joblib")

# fixed default rates
DEFAULT_RATES = {
    "Add_Urea": 40,
    "Add_SSP": 170,
    "Add_Potash": 16,
    "Add_NK": 50,
    "Add_DAP": 100,
    "Add_NPK_17_17_17": 120,
    "No_Fertilizer_Needed": 0
}

def predict_one(sample: dict):
    df = pd.DataFrame([sample])
    X  = PREP.transform(df)
    lbl = MODEL.predict(X)[0]
    return lbl, DEFAULT_RATES[lbl]

@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.json
    label, rate = predict_one(data)
    return jsonify({"label": label, "rate": rate})

@app.route("/api/batch", methods=["POST"])
def api_batch():
    # expects a CSV file form-field "file"
    file = request.files["file"]
    df   = pd.read_csv(file)
    results = []
    for idx, row in df.iterrows():
        sample = row.to_dict()
        label, rate = predict_one(sample)
        results.append({**sample, "pred_label": label, "rate": rate})
    return jsonify(results)

@app.route("/api/simulate", methods=["GET"])
def api_simulate():
    # return one random valid sample for virtual IoT
    sample = {
      "phosporus(ppm)": round(random.uniform(2,6),2),
      "K(cmol/kg)":       round(random.uniform(0.2,0.5),3),
      "TN":               round(random.uniform(0.8,2.5),2),
      "OC":               round(random.uniform(15,30),1),
      "CEC":              round(random.uniform(10,20),1),
      "Sand":             random.randint(20,60),
      "Silt":             random.randint(10,50),
      "Clay":             random.randint(10,40),
      "MAP":              round(random.uniform(800,1400),1),
      "Elevation":        random.randint(1400,1800),
      "Crop_inter":       random.choice(["Maize","Bean","Rice, lowland"])
    }
    return jsonify(sample)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
