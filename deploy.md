# Deployment Guide (Vercel)

This project consists of a Next.js frontend (`client`) and an Express backend (`server`).

## 1. Prerequisites
- [Vercel Account](https://vercel.com/)
- [Vercel CLI](https://vercel.com/docs/cli) (Optional but recommended)
- A GitHub/GitLab/Bitbucket repository with your code.

## 2. Deploying the Client (Next.js)

1.  Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New"** > **"Project"**.
3.  Import your repository.
4.  In the **Project Settings**:
    - **Root Directory:** Select `client`.
    - **Framework Preset:** Next.js.
5.  **Environment Variables:** Add all variables from `client/.env.local` (if any), such as:
    - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://your-server.vercel.app/api`).
6.  Click **Deploy**.

## 3. Deploying the Server (Express)

Vercel can host Express apps as Serverless Functions.

1.  Create a `vercel.json` file in the `server/` directory:
    ```json
    {
      "version": 2,
      "builds": [
        {
          "src": "server.js",
          "use": "@vercel/node"
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "server.js"
        }
      ]
    }
    ```
2.  Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
3.  Click **"Add New"** > **"Project"**.
4.  Import the same repository.
5.  In the **Project Settings**:
    - **Root Directory:** Select `server`.
    - **Framework Preset:** Other.
6.  **Environment Variables:** Add all variables from `server/.env`:
    - `MONGO_URI`
    - `JWT_SECRET`
    - `CLOUDINARY_NAME`
    - `CLOUDINARY_KEY`
    - `CLOUDINARY_SECRET`
    - `RESEND_API_KEY`
7.  Click **Deploy**.

## 4. Post-Deployment
- Update the `NEXT_PUBLIC_API_URL` in the **Client** settings to point to the production **Server** URL.
- Redeploy the Client to apply the change.

## 5. Alternative (Render/Railway)
If you prefer a persistent Express server (for things like heavy cron jobs or socket connections), consider using [Render](https://render.com/) or [Railway](https://railway.app/) for the `server` folder.
