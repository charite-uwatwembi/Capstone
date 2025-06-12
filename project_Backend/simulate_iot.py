import time
import requests

BACKEND_URL = "http://127.0.0.1:5000/api/predict"

def simulate_and_send(n=20, delay=5):
    for i in range(n):
        # ask the back-end for a simulated sample
        sim = requests.get("http://127.0.0.1:5000/api/simulate").json()
        sample = sim["sample"]
        # now post that same sample to /api/predict
        resp = requests.post(BACKEND_URL, json=sample).json()
        print(f"[{i+1}/{n}] sample={sample} →  label={resp['label']}, rate={resp['rate_kg_ha']} kg/ha")
        time.sleep(delay)

if __name__ == "__main__":
    simulate_and_send()
