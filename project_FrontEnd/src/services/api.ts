import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function predict(sample: any) {
  const resp = await axios.post(`${BASE}/api/predict`, sample);
  return resp.data;                // { label, rate }
}

export async function batchPredict(file: File) {
  const form = new FormData();
  form.append("file", file);
  const resp = await axios.post(`${BASE}/api/batch`, form);
  return resp.data;                // array of { …, pred_label, rate }
}

export async function simulateIoT() {
  const resp = await axios.get(`${BASE}/api/simulate`);
  return resp.data;                // one sample
}
