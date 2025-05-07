#!/bin/bash

echo "========================================"
echo "🚀 Starting Django Production Build with Gunicorn"
echo "========================================"

# 1. Activate Virtual Environment
if [ -d "venv" ]; then
    echo "👉 Activating virtual environment..."
    source venv/bin/activate
else
    echo "⚠️  Virtual environment not found. Skipping activation."
fi

# 2. Install Python Dependencies
echo "📦 Installing requirements..."
pip install -r requirements.txt

# 3. Run Database Migrations
echo "📂 Applying database migrations..."
python manage.py migrate --noinput

# 4. Collect Static Files
echo "🎯 Collecting static files..."
python manage.py collectstatic --noinput

# 5. Start Gunicorn Server
echo "🔥 Starting Gunicorn server..."
gunicorn aurora_skin_analyzer.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --log-level info \
    --access-logfile access.log \
    --error-logfile error.log

echo "✅ Django app is running on Gunicorn at http://localhost:8000"
