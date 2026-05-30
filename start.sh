#!/usr/bin/env bash
# Start the Institutional Memory Agent backend + frontend

echo "🚀 Institutional Memory Agent"
echo "================================"

# Check Python
if ! command -v python3 &> /dev/null; then
  echo "❌ Python3 not found. Please install Python 3.11+"
  exit 1
fi

# Check if .env exists for backend
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "📋 Created backend/.env from template"
  echo "   ⚠️  Edit backend/.env and add your OPENAI_API_KEY"
fi

# Install Python deps if venv doesn't exist
if [ ! -d backend/venv ]; then
  echo "🐍 Creating Python virtual environment..."
  python3 -m venv backend/venv
  echo "📦 Installing Python dependencies..."
  backend/venv/bin/pip install -q -r backend/requirements.txt
  echo "✅ Python environment ready"
fi

# Start FastAPI backend in background
echo ""
echo "🔧 Starting FastAPI backend on http://localhost:8000 ..."
cd backend
../backend/venv/bin/uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3
echo "📡 Backend health check..."
curl -sf http://localhost:8000/health && echo " ✅ Backend online" || echo " ⚠️  Backend starting up..."

# Start Vite frontend
echo ""
echo "⚡ Starting Vite frontend on http://localhost:5173 ..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo "✅ App running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "================================"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" SIGINT SIGTERM
wait
