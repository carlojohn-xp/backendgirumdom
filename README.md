# Girumdom - Memory Management Web Application

A full-stack web application for managing memories, reminders, and collaborations with Text-to-Speech (TTS) functionality.

## Overview

Girumdom is a comprehensive memory management system that allows users to:
- Create and manage personal memories with rich content
- Upload and attach images to memories
- Generate audio narrations using Text-to-Speech
- Set reminders for memories
- Collaborate with other users
- Control access through a permission system for assistant users

## Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Setup Backend**
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your database credentials
mysql -u root -p < girumdom_db.sql
node server.js
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## Technology Stack

### Backend
- Node.js + Express
- MySQL database
- JWT authentication
- Cloudinary (image/audio storage)
- @xenova/transformers (TTS)

### Frontend
- React
- React Router
- Axios
- Context API for state management

## Features

### Core Functionality
- User authentication (main users and assistants)
- Memory CRUD operations with permission checks
- Image uploads and gallery view
- Text-to-Speech audio generation
- Reminder system with notifications
- Collaboration spaces for shared memories
- Storyteller management

### Security
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Permission system for assistant users
- CORS protection

## Documentation

Detailed documentation is available in the following files:

- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Complete setup and installation guide
- **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)** - API endpoint reference and testing examples
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive project documentation

## Project Structure

```
project/
├── Backend/              # Node.js + Express backend
│   ├── api/
│   │   ├── connections/  # Database models
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth & permissions
│   │   └── utils/        # Utility functions
│   └── server.js
│
└── frontend/            # React application
    ├── src/
    │   ├── components/  # UI components
    │   ├── pages/       # Page components
    │   ├── contexts/    # React contexts
    │   └── services/    # API services
    └── public/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Memories
- `GET /api/memory/user` - Get user memories
- `POST /api/memory` - Create memory
- `PUT /api/memory/:id` - Update memory
- `DELETE /api/memory/:id` - Delete memory

### Reminders
- `GET /api/reminder/user` - Get reminders
- `POST /api/reminder` - Create reminder
- `PATCH /api/reminder/:id/complete` - Mark complete

### Collaborations
- `GET /api/collaboration/user` - Get collaborations
- `POST /api/collaboration` - Create collaboration
- `POST /api/collaboration/:id/members` - Add member

### Media
- `POST /api/images/base64` - Upload image
- `POST /api/tts` - Generate TTS audio

See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for complete endpoint documentation.

## Usage

### Creating a Memory

1. Login to your account
2. Click "Add Memory" on the dashboard
3. Fill in title, content, and event date
4. Optionally upload images
5. Click "Create"

### Generating Audio

1. View a memory by clicking "Expand"
2. Scroll to the audio section
3. Click "Generate Audio"
4. Wait for processing
5. Click "Play" to listen or "Download" to save

### Setting Reminders

1. Click "Add Reminder" in the sidebar
2. Select a memory
3. Set date and time
4. Click "Create Reminder"

## Permission System

### Main Users
- Full access to all features
- Can manage assistant users
- Can create, edit, delete all content

### Assistant Users
- Linked to a main user
- Permissions set via ASSISTANT_PERMISSION table
- Default: can create memories and reminders
- Cannot delete unless granted permission

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=girumdom
DB_PORT=3306
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Testing

Run the frontend build to verify everything works:
```bash
cd frontend
npm run build
```

Test API endpoints using curl or Postman:
```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","user_type":"main"}'
```

See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for more examples.

## Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify .env database credentials
- Ensure girumdom database exists

### Frontend can't connect
- Verify backend is running on port 3000
- Check REACT_APP_API_URL in frontend/.env
- Check browser console for CORS errors

### TTS not working
- Ensure sufficient disk space for model download
- Check Cloudinary credentials
- Verify internet connection for first-time model download

## Contributing

This is a thesis project for GIRUMDOM. For questions or contributions, please contact the development team.

## License

This project is part of an academic thesis.

## Support

For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

For API documentation, see [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

For project overview, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) 
