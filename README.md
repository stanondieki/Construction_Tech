# UjenziIQ - Construction Project Management Platform

UjenziIQ is a sophisticated real-time construction project health monitoring and communication platform designed for the East African market. The system serves as a central nervous system for construction operations, providing stakeholders with instant visibility into project progress, resource utilization, safety incidents, and milestone achievements.

## Project Structure

The project consists of two main components:

- **Backend**: Django-based REST API with PostgreSQL database
- **Frontend**: Next.js with TypeScript and Tailwind CSS

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```
cd ujenziiq-backend
```

2. Create a virtual environment:
```
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Unix/MacOS: `source venv/bin/activate`

4. Install dependencies:
```
pip install -r requirements.txt
```

5. Run migrations:
```
python manage.py migrate
```

6. Create a superuser:
```
python manage.py createsuperuser
```

7. Start the development server:
```
python manage.py runserver
```

The backend API will be available at http://localhost:8000/api/

### Frontend Setup

1. Navigate to the frontend directory:
```
cd ujenziiq-frontend
```

2. Install dependencies:
```
npm install
```

3. Run the development server:
```
npm run dev
```

The frontend application will be available at http://localhost:3000/

## Features

- Project management with real-time updates
- Task assignment and tracking
- Material inventory and resource allocation
- Safety incident reporting and monitoring
- Team communication and messaging
- Progress reporting and analytics
- Mobile-responsive design for field use

## Technologies Used

- **Backend**:
  - Django
  - Django REST Framework
  - PostgreSQL (SQLite for development)
  - JWT Authentication

- **Frontend**:
  - Next.js
  - TypeScript
  - Tailwind CSS
  - React Context API
  - Axios

## License

[MIT License](LICENSE)
