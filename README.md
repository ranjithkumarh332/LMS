# Employability Intelligence Platform

A full-stack application for higher education institutions to assess student competencies, run structured interventions, and prove placement readiness.

## Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Context API for state management
- Axios for HTTP requests

### Backend
- Go (Golang) with Gin framework
- MongoDB with MongoDB Driver
- JWT Authentication

## Project Structure

```
/LMS
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/           # API service modules
│   │   ├── styles/            # Global CSS
│   │   └── utils/             # Utility functions
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Go Backend
│   ├── cmd/
│   │   └── api/
│   │       └── main.go        # Application entry point
│   ├── internal/
│   │   ├── api/
│   │   │   ├── handlers/      # HTTP handlers
│   │   │   ├── middleware/     # Auth middleware
│   │   │   └── routes/        # Route definitions
│   │   ├── config/            # Configuration
│   │   ├── database/          # MongoDB connection
│   │   ├── models/            # Data models
│   │   ├── repositories/      # Database operations
│   │   └── services/           # Business logic
│   ├── go.mod
│   └── go.sum
│
├── docs/                      # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- MongoDB (local or Atlas)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
go mod download
go run cmd/api/main.go
```

### Environment Variables

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017
MONGO_DATABASE=eip_platform
JWT_SECRET=your-secret-key
SERVER_PORT=8080
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8080/api
```

## Features

### User Roles

1. **Super Admin** - Platform-wide management
   - Manage colleges
   - Manage departments
   - User management
   - System settings

2. **College Admin** - College-level management
   - Student management
   - Trainer management
   - Assessments
   - Reports

3. **Trainer** - Teaching and assessment
   - Quiz creation
   - Workshop management
   - Student progress tracking

4. **Student** - Learning and assessment
   - Take assessments
   - View progress
   - Resume upload
   - Workshop enrollment

### Core Features

- JWT Authentication with refresh tokens
- Role-based access control
- Student assessments with proctoring
- Quiz creation wizard
- Workshop scheduling
- Cohort management
- Resume upload and management
- Notifications system
- Audit logging
- PDF/Excel report generation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Students
- `GET /api/students` - List students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/:id/resume` - Upload resume
- `DELETE /api/students/:id/resume` - Delete resume

### Trainers
- `GET /api/trainers` - List trainers
- `GET /api/trainers/:id` - Get trainer by ID
- `POST /api/trainers` - Create trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Colleges
- `GET /api/colleges` - List colleges
- `GET /api/colleges/:id` - Get college by ID
- `POST /api/colleges` - Create college
- `PUT /api/colleges/:id` - Update college
- `DELETE /api/colleges/:id` - Delete college
- `POST /api/colleges/:id/activate` - Activate college
- `POST /api/colleges/:id/deactivate` - Deactivate college

### Assessments
- `GET /api/assessments` - List assessments
- `GET /api/assessments/:id` - Get assessment by ID
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment
- `POST /api/assessments/:id/publish` - Publish assessment
- `POST /api/assessments/:id/archive` - Archive assessment

### Quizzes
- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/start` - Start quiz attempt
- `POST /api/quizzes/:id/submit` - Submit quiz
- `GET /api/quizzes/:id/results/:attemptId` - Get quiz results

### Cohorts
- `GET /api/cohorts` - List cohorts
- `GET /api/cohorts/:id` - Get cohort by ID
- `POST /api/cohorts` - Create cohort
- `PUT /api/cohorts/:id` - Update cohort
- `DELETE /api/cohorts/:id` - Delete cohort

### Workshops
- `GET /api/workshops` - List workshops
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops` - Create workshop
- `PUT /api/workshops/:id` - Update workshop
- `DELETE /api/workshops/:id` - Delete workshop
- `POST /api/workshops/:id/enroll` - Enroll in workshop
- `POST /api/workshops/:id/unenroll` - Unenroll from workshop

### Notifications
- `GET /api/notifications` - List notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

### Audit Logs
- `GET /api/audit-logs` - List audit logs (admin only)

## Database Collections

- `users` - User accounts
- `colleges` - College institutions
- `departments` - Department definitions
- `cohorts` - Student cohorts
- `workshops` - Workshop sessions
- `workshop_enrollments` - Workshop registrations
- `question_banks` - Question bank templates
- `questions` - Individual questions
- `assessments` - Assessment templates
- `quiz_attempts` - Quiz attempt records
- `notifications` - User notifications
- `audit_logs` - Activity logs
- `resumes` - Uploaded resumes
- `interventions` - Student interventions

## Deployment

### Frontend (Vercel)

1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Backend (Vercel Functions)

For serverless deployment, consider:
- Converting to Vercel Functions
- Using a managed MongoDB service (Atlas)
- Deploying to a VPS with Docker

### MongoDB Atlas

1. Create a free cluster at mongodb.com
2. Get connection string
3. Update `MONGO_URI` environment variable

## Security

- Passwords hashed with bcrypt
- JWT tokens with expiration
- Role-based access control
- Input validation on all endpoints
- Secure headers middleware
- CORS configuration

## License

MIT License
