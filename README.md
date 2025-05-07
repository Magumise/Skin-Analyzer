# AI Skin Analyzer

An intelligent web application that analyzes skin conditions using artificial intelligence and provides personalized skincare recommendations.

## Features

- Real-time skin condition analysis using AI
- Personalized skincare recommendations
- User authentication and profile management
- Progress tracking and history
- Responsive web interface

## Tech Stack

### Backend
- Django
- Django REST Framework
- TensorFlow/Keras
- PostgreSQL (Supabase)

### Frontend
- React
- TypeScript
- Tailwind CSS
- Material-UI

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- PostgreSQL (for local development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-skin-analyzer.git
cd ai-skin-analyzer
```

2. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Deployment

The application is configured for deployment on:
- Backend: Render.com
- Frontend: Vercel
- Database: Supabase

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- TensorFlow team for the machine learning framework
- Django team for the web framework
- React team for the frontend library 