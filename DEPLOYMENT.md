# InfraSight AI - Deployment Guide

This guide details how to deploy the InfraSight AI platform into a live, production-ready environment.

## Architecture

We are deploying using the following stack:
* **Frontend**: React + Vite on **Vercel**
* **Backend**: FastAPI on **Render**
* **AI Engine**: Gemini API (`gemini-1.5-pro`)

## 1. Backend Deployment (Render)

Render makes deploying FastAPI apps incredibly easy.

1. Create a `render.yaml` (optional) or deploy via the Render Dashboard.
2. Ensure you have the `requirements.txt` pushed to your Git repository.
3. In the Render Dashboard, click **New > Web Service**.
4. Connect your GitHub repository.
5. Set the settings:
   * **Root Directory**: `backend`
   * **Environment**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app:app --host 0.0.0.0 --port 10000`
6. Add your Environment Variables:
   * `GEMINI_API_KEY`: <Your Google Gemini API Key>

*Note*: Because Uvicorn listens on port 10000 by default on Render, Render will route public HTTP traffic to it automatically.

## 2. Frontend Deployment (Vercel)

Vercel is the optimal host for our React frontend.

1. Ensure the `frontend` folder has its `package.json`.
2. Important: In your `App.jsx`, change `http://localhost:8000/analyze` to point to your new Render URL (`https://your-backend.onrender.com/analyze`).
   * Alternatively, set an environment variable `VITE_API_URL` and use `import.meta.env.VITE_API_URL + '/analyze'`.
3. Go to Vercel and create a **New Project**.
4. Important settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
5. Click **Deploy**.

## 3. Custom CV Model (Optional Future Step)

If you decide to re-incorporate YOLO in the future for local bounding-box drawing, you will want to containerize the FastAPI backend via Docker. This ensures OpenCV and system libraries install predictably. For the pure Gemini LLM implementation, Docker is not strictly necessary but recommended for scalability.

---
**Resume Pro Tip:**
Add the live Vercel URL to the top of your resume next to the GitHub icon!
