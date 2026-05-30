#!/usr/bin/env bash

# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Run the FastAPI server
uvicorn main:app --reload --port 8000
#!/usr/bin/env bash

# Navigate to the frontend directory
cd frontend

# Start the Vite development server
npm run dev


bash start.sh
