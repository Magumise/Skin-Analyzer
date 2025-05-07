#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Build the Docker image
echo "Building Docker image..."
docker build -t ai-skin-analyzer-backend .

# Push to Google Container Registry (GCR)
echo "Pushing to Google Container Registry..."
docker tag ai-skin-analyzer-backend gcr.io/your-project-id/ai-skin-analyzer-backend
docker push gcr.io/your-project-id/ai-skin-analyzer-backend

# Deploy to Google Cloud Run
echo "Deploying to Google Cloud Run..."
gcloud run deploy ai-skin-analyzer \
  --image gcr.io/your-project-id/ai-skin-analyzer-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DEBUG=False" \
  --set-env-vars="SECRET_KEY=your-secret-key" \
  --set-env-vars="ALLOWED_HOSTS=*.run.app" \
  --set-env-vars="DATABASE_URL=postgresql://postgres:postgres@/ai_skin_analyzer?host=/cloudsql/your-project-id:us-central1:your-instance-name" \
  --set-env-vars="AI_SERVICE_URL=https://us-central1-aurora-457407.cloudfunctions.net/predict" \
  --set-env-vars="CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com"

echo "Deployment completed successfully!" 