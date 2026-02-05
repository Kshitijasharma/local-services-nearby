## Frontend

cd frontend
npm install  # or bun install (project uses bun)
npm run dev


## Backend

Initial setup:

cd backend
#python -m venv venv
venv\Scripts\activate  # On Windows
# or: source venv/bin/activate (on Mac/Linux)
pip install -r requirements.txt

Run the server:

uvicorn app.main:app --reload --port 8000

## Run docker which contains redis

To start Redis in the Docker:

docker run -d -p 6379:6379 redis:latest

Docker compose setup:

docker-compose up -d

## So the complete startup order would be:

Start Redis: docker run -d -p 6379:6379 redis:latest
Start Backend: uvicorn app.main:app --reload --port 8000
Start Frontend: npm run dev