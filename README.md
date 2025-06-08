
# SoilSync Dashboard

## Description

SoilSync is an end-to-end smart‐agriculture dashboard that ingests soil sensor data, either manually entered or streamed via a virtual IoT simulator, and uses a trained Random Forest model to recommend the optimal fertilizer blend and application rate. The web interface presents:

- **Real-time Recommendations**: Instantly view fertilizer type, rate (kg/ha), and confidence score.  
- **Soil Data Visualizations**: Bar charts of N, P, K levels and time-series trends of past recommendations.  
- **Historical Log**: Table of previous samples, recommended fertilizers, rates, and soil readings.  
- **Agriculture News**: Integrated feed of Rwandan agriculture headlines with generated images.  
- **Dark/Light Mode & Responsive UI**: Modern, animated React + TailwindCSS design inspired by the “Stellarsync” SaaS dashboard.

Everything lives on a single responsive page with a collapsible sidebar, animated components, and smooth transitions.

## Repository

https://github.com/charite-uwatwembi/Capstone

## Setup & Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/charite-uwatwembi/Capstone
   cd capstone
``


2. **Backend (Flask)**

   ```bash
      cd backend
      python3 -m venv venv
      .\venv\Scripts\Activate   
      pip install -r requirements.txt
      flask run
   ```

3. **Frontend (React + TailwindCSS)**

   ```bash
   cd ../project_FrontEnd
   npm install
   npm start
   ```

   * Dashboard will open at `http://localhost:3000`
   * By default, the front end calls `localhost:5000/api` for predictions and IoT simulation.

## Design


* **Screenshots**:
  ![Main Dashboard](/docs/screenshots/image.png)
  ![Soil Form & Recommendation](docs/screenshots/form-recommendation.png)

## Deployment Plan

1. **Containerize** both backend and frontend with Docker.
2. Push images to a registry (Docker Hub).
3. Deploy on a managed Kubernetes cluster:

   * Flask service behind an API Gateway or Load Balancer.
   * React build served via an S3-backed CloudFront distribution (or NGINX container).
4. Set up CI/CD with GitHub Actions: on push to `main`, run tests, build & push Docker images, then update live environment.
5. Configure HTTPS via Let’s Encrypt.
6. Monitor with Prometheus + Grafana and set alerts for latency or error spikes.

## Video Demo

▶️ Watch the end-to-end workflow and UI walkthrough here:
[Demo-video](https://www.youtube.com/watch?v=8iXgbMQsK1w)

---

Enjoy exploring SoilSync, your intelligent soil fertility advisor!

```
````
