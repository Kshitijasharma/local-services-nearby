### Update : Removed Redis, as my website doesnot have too much traffic yet to manage and backend needs to be deployed and managed accurately.

# LocalFind

LocalFind is a web application that helps users discover local services and places nearby. It features a modern frontend built with React and a robust backend powered by FastAPI, utilizing Redis for caching and Geoapify for location services.

## 🚀 Features

-   **Place Discovery**: Find local services and places based on location.
-   **Interactive UI**: Built with React, Tailwind CSS, and Shadcn UI for a premium user experience.
-   **High Performance**: Backend optimized with FastAPI and Redis caching.
-   **Location Services**: Integrated with Geoapify for accurate implementation.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
-   **State Management**: [TanStack Query](https://tanstack.com/query/latest)
-   **Language**: TypeScript

### Backend
-   **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
-   **Server**: Uvicorn
-   **Database/Cache**: [Redis](https://redis.io/)
-   **APIs**: Geoapify
-   **Language**: Python

## 🏁 Getting Started

### Prerequisites

-   **Node.js** (v18+ recommended) or **Bun**
-   **Python** (v3.9+ recommended)
-   **Docker** (optional, for running Redis locally)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd explore-n
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory with the following variables:

```env
GEOAPIFY_API_KEY=your_geoapify_key
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:5173
```

Start Redis (using Docker):

```bash
docker run -d -p 6379:6379 redis:latest
```

Start the Backend Server:

```bash
uvicorn app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
# or
bun install
```

**Environment Variables:**
Create a `.env` file in the `frontend` directory (or use `.env.local`):

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the Development Server:

```bash
npm run dev
```
The application will be running at `http://localhost:5173`.

## 📦 Deployment

This project is configured for deployment on **Vercel** (Frontend) and **Railway** (Backend).

Please refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📂 Project Structure

```
explore-n/
├── backend/            # FastAPI backend
│   ├── app/            # Application logic
│   ├── venv/           # Virtual environment
│   ├── requirements.txt
│   └── ...
├── frontend/           # React frontend
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── package.json
│   └── ...
├── DEPLOYMENT.md       # Deployment guide
└── README.md           # Project documentation
```
## UML Architecture:

<img width="523" height="789" alt="image" src="https://github.com/user-attachments/assets/c51b8b40-2594-460c-b42a-d162b6ef90fc" />

## Sequence Diagran (Request Flow):

<img width="779" height="475" alt="image" src="https://github.com/user-attachments/assets/ae2cbc4a-3420-49f1-8bc2-ab5d4b4c479d" />


## 📄 License

[MIT License](LICENSE)
