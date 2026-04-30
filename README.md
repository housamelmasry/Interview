# Interview Q&A App

A full-stack application for managing interview questions and answers.

## Project Structure

```
project/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── docker-compose.yml
├── .env
└── README.md
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository
2. Run `docker-compose up --build`
3. Open your browser to `http://localhost:5173`

### API

- Backend runs on `http://localhost:3000`
- Health check: `GET /api/health`

## Development

### Backend

- Node.js + Express
- Runs on port 3000

### Frontend

- React + Vite
- Runs on port 5173