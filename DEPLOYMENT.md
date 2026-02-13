# Deployment Guide

This guide covers how to deploy the **LocalFind** application.
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Redis (Managed by Railway)
- **External API**: Geoapify

---

## Prerequisites

1.  GitHub account (to host the repository).
2.  Twilio / Vercel account.
3.  Railway account.
4.  Geoapify API key.

> [!CAUTION]
> **Do NOT push your `.env` file to GitHub!**
> Your `.env` file contains secret API keys. Hackers scan GitHub for these keys to steal them.
> Instead, you will enter these keys manually into the "Environment Variables" section of Railway and Vercel.

---

## 1. Backend Deployment (Railway)

1.  **Login to Railway**: Go to [railway.app](https://railway.app/) and login.
2.  **New Project**: Click "New Project" -> "Deploy from GitHub repo".
3.  **Select Repository**: Choose this repository.
4.  **Configure Service**:
    - Railway might detect multiple folders. Select the `backend` folder as the root for the backend service.
    - If it doesn't ask, go to Settings -> Root Directory and set it to `/backend`.
5.  **Add Redis**:
    - In the same project, click "New" -> "Database" -> "Redis".
6.  **Environment Variables**:
    - Go to your backend service -> "Variables".
    - Add the following:
        - `GEOAPIFY_API_KEY`: Your Geoapify API Key.
        - `REDIS_URL`: The value from your Redis service (find it in the Redis service "Variables" or "Connect" tab).
        - `ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app` (You will set this *after* deploying frontend, for now you can leave it empty or set to `*`).
7.  **Deploy**: Railway should auto-deploy. Check the "Deployments" tab for logs.

---

## 2. Frontend Deployment (Vercel)

1.  **Login to Vercel**: Go to [vercel.com](https://vercel.com/) and login.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Git Repository**: Select this repository.
4.  **Configure Project**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    - Add `VITE_API_BASE_URL`: The URL of your deployed Railway backend (e.g., `https://web-production-xxxx.up.railway.app`). **Do not add a trailing slash.**
6.  **Deploy**: Click "Deploy".

---

## 3. Final Connection

1.  Once Vercel deployment is complete, copy the domain (e.g., `https://explore-n.vercel.app`).
2.  Go back to **Railway** -> Backend Service -> Variables.
3.  Update `ALLOWED_ORIGINS` with your Vercel domain (no trailing slash).
4.  Railway will redeploy the backend.

## Troubleshooting

-   **CORS Errors**: Check if `ALLOWED_ORIGINS` in Railway matches your Vercel URL exactly (https vs http, trailing slash).
-   **Backend 404**: Ensure `VITE_API_BASE_URL` in Vercel is correct and has no trailing slash.
-   **Redis Connection Error**: Ensure `REDIS_URL` is correct in Railway backend variables.
