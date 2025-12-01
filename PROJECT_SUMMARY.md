# Girumdom Web Application - Project Summary

## Overview

Girumdom is a full-stack web application for managing memories, reminders, and collaborations with built-in Text-to-Speech (TTS) functionality. It features a Node.js/Express backend with MySQL database and a React-based frontend with user authentication and permission management.

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **TTS**: @xenova/transformers (facebook/mms-tts-tgl model)

### Frontend
- **Framework**: React
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS (modular approach)

## Project Structure

```
project/
├── Backend/
│   ├── api/
│   │   ├── connections/          # Database layer
│   │   │   ├── pool.js           # MySQL connection pool
│   │   │   ├── user.js           # User operations
│   │   │   ├── memory.js         # Memory operations
│   │   │   ├── reminder.js       # Reminder operations
│   │   │   ├── collaboration.js  # Collaboration operations
│   │   │   ├── permission.js     # Permission operations
│   │   │   ├── photoImage.js     # Image operations
│   │   │   ├── tts.js            # TTS operations
│   │   │   ├── storyteller.js    # Storyteller operations
│   │   │   └── cloudinary.js     # Cloudinary configuration
│   │   │
│   │   ├── controllers/          # Route handlers
│   │   │   ├── auth_controller.js
│   │   │   ├── memory_controller.js
│   │   │   ├── reminder_controller.js
│   │   │   ├── collaboration_controller.js
│   │   │   ├── photoimage_controller.js
│   │   │   ├── tts_controller.js
│   │   │   ├── storyteller_controller.js
│   │   │   └── storyteller_memory_controller.js
│   │   │
│   │   ├── middleware/           # Middleware functions
│   │   │   ├── auth.js           # JWT authentication
│   │   │   ├── permissions.js    # Permission checks
│   │   │   └── upload.js         # File upload handling
│   │   │
│   │   └── utils/                # Utility functions
│   │       ├── ttsService.js     # TTS generation
│   │       ├── fileCleanup.js    # Temp file cleanup
│   │       └── imageProcessor.js # Image processing
│   │
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── girumdom_db.sql          # Database schema
│
└── frontend/
    ├── src/
    │   ├── components/           # React components
    │   │   ├── ProtectedRoute.js
    │   │   ├── MemoryList.js
    │   │   ├── MemoryForm.js
    │   │   ├── ReminderList.js
    │   │   ├── ReminderForm.js
    │   │   ├── CollaborationList.js
    │   │   └── AudioPlayer.js
    │   │
    │   ├── pages/                # Page components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   │
    │   ├── contexts/             # React contexts
    │   │   └── AuthContext.js
    │   │
    │   ├── services/             # API service layer
    │   │   └── api.js
    │   │
    │   ├── styles/               # CSS files
    │   │   ├── Auth.css
    │   │   └── Dashboard.css
    │   │
    │   ├── App.js               # Main app component
    │   └── App.css              # Global styles
    │
    ├── package.json
    └── .env                     # Frontend config
```

## Database Schema

### Core Tables

1. **USER** - User accounts (main and assistant types)
2. **MEMORY** - Memory records with title, content, date
3. **REMINDER** - Reminders linked to memories
4. **COLLABORATION** - Collaboration spaces
5. **USER_COLLABORATION** - User-collaboration relationships
6. **COLLABORATION_MEMORY** - Memory-collaboration associations
7. **AUDIO** - TTS audio files
8. **PHOTO_IMAGE** - Image attachments
9. **STORYTELLER** - Storyteller entities
10. **STORYTELLER_MEMORY** - Storyteller-memory relationships
11. **ASSISTANT_PERMISSION** - Permission settings for assistants

### Key Relationships

- Users can be "main" or "assistant" types
- Assistant users are linked to a main user via `main_user_id`
- Memories belong to a user and are created by a user (can be different)
- Reminders are linked to memories
- Collaborations can have multiple users with different roles
- Images and audio are associated with memories

## Features Implemented

### Authentication & Authorization
- User registration (main and assistant accounts)
- Email/password login
- JWT-based session management
- Token refresh and validation
- Role-based access control
- Fine-grained permission system for assistants

### Memory Management
- Create, read, update, delete memories
- Rich text content with dates
- Image attachments (multiple per memory)
- Permission-based editing/deletion
- Memory search and filtering

### Reminder System
- Create reminders linked to memories
- Date/time scheduling
- Mark as complete functionality
- View upcoming reminders
- Filter by date range

### Collaboration Features
- Create collaboration spaces
- Invite users with roles (owner, editor, viewer)
- Share memories within collaborations
- View collaboration members
- Manage collaboration settings

### Text-to-Speech (TTS)
- Generate audio narration from memory text
- Supports Tagalog language (facebook/mms-tts-tgl)
- Audio file storage in Cloudinary
- In-browser audio playback
- Download audio files
- Caching to avoid regeneration

### Image Management
- Upload multiple images per memory
- Base64 and multipart/form-data support
- Cloud storage via Cloudinary
- Image viewing in grid layout
- Image deletion

### User Interface
- Responsive design for desktop and tablet
- Clean, modern aesthetic
- Modal forms for data entry
- Real-time feedback and validation
- Loading states and error handling
- Dashboard with organized sections

## API Endpoints Summary

### Authentication (`/api/auth`)
- POST `/register` - Register new user
- POST `/login` - Login user
- GET `/me` - Get current user
- POST `/logout` - Logout

### Memories (`/api/memory`)
- GET `/` - Get all memories
- GET `/user` - Get user's memories
- GET `/:id` - Get single memory
- POST `/` - Create memory (auth + permission)
- PUT `/:id` - Update memory (auth + permission)
- DELETE `/:id` - Delete memory (auth + permission)

### Reminders (`/api/reminder`)
- GET `/user` - Get user's reminders
- GET `/upcoming` - Get upcoming reminders
- POST `/` - Create reminder
- PUT `/:id` - Update reminder
- PATCH `/:id/complete` - Mark complete
- DELETE `/:id` - Delete reminder

### Collaborations (`/api/collaboration`)
- GET `/user` - Get user's collaborations
- GET `/:id` - Get collaboration details
- POST `/` - Create collaboration
- GET/POST/DELETE `/:id/members` - Manage members
- GET/POST/DELETE `/:id/memories` - Manage memories

### Images (`/api/images`)
- GET `/memory/:id` - Get memory images
- POST `/` - Upload image (multipart)
- POST `/base64` - Upload image (base64)
- DELETE `/:id` - Delete image

### TTS (`/api/tts`)
- POST `/` - Generate TTS audio
- GET `/:memory_id` - Get audio URL

### Storytellers (`/api/storyteller`)
- Full CRUD operations
- Associate with memories

## Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - No plain text password storage

2. **JWT Authentication**
   - Secure token generation
   - 24-hour expiration
   - Token validation on protected routes

3. **Permission System**
   - Row-level access control
   - Assistant permission verification
   - Action-specific permissions (create, edit, delete)

4. **Input Validation**
   - Required field validation
   - Email format validation
   - Type checking

5. **CORS Configuration**
   - Controlled cross-origin access
   - Proper headers exposure

## Permission System

### Main Users
- Full access to all features
- Can create, edit, delete memories
- Can upload media
- Can manage collaborations
- Can create reminders

### Assistant Users
- Linked to a main user
- Permissions controlled via ASSISTANT_PERMISSION table
- Default permissions: can_create_memory, can_create_reminder
- Restricted permissions must be explicitly granted
- Cannot access other users' data

### Permission Types
- `can_create_memory` - Create new memories
- `can_edit_memory` - Edit existing memories
- `can_delete_memory` - Delete memories
- `can_create_reminder` - Create reminders
- `can_upload_media` - Upload images/files

## Key Frontend Components

### AuthContext
- Manages authentication state
- Provides login/logout functions
- Token persistence
- User role checking

### ProtectedRoute
- Route guard component
- Redirects unauthenticated users
- Loading state handling

### Dashboard
- Main application interface
- Displays memories, reminders, collaborations
- Action buttons and forms
- Responsive layout

### MemoryList & MemoryForm
- Display and manage memories
- Expandable cards with details
- Image gallery
- Audio player integration

### ReminderList & ReminderForm
- Reminder display and creation
- Completion tracking
- Date/time selection

### AudioPlayer
- TTS audio generation
- Playback controls
- Download functionality
- Caching support

## Environment Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=girumdom
DB_PORT=3306
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Running the Application

### Backend
```bash
cd Backend
npm install
node server.js
```
Runs on: http://localhost:3000

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs on: http://localhost:3001

### Production Build
```bash
cd frontend
npm run build
```
Creates optimized build in `frontend/build/`

## Testing

### Manual Testing
- Use the provided API_TESTING_GUIDE.md
- Test with curl or Postman
- Verify permission restrictions
- Test TTS generation
- Validate image uploads

### Test Scenarios
1. User registration and login
2. Memory CRUD operations
3. Reminder creation and management
4. Permission enforcement
5. Image upload and display
6. TTS audio generation
7. Collaboration features

## Future Enhancements

### Potential Features
1. Email notifications for reminders
2. Social sharing capabilities
3. Advanced search and filtering
4. Memory timelines and visualization
5. Multi-language TTS support
6. Video attachments
7. Export memories to PDF
8. Mobile app (React Native)
9. Real-time collaboration
10. AI-powered memory suggestions

### Technical Improvements
1. Unit and integration tests
2. API rate limiting
3. Caching layer (Redis)
4. Database indexing optimization
5. Error logging service
6. Analytics integration
7. Automated backups
8. CI/CD pipeline
9. Docker containerization
10. Load balancing

## Known Issues

1. TTS generation can be slow for long texts
2. Large image uploads may timeout
3. No pagination on memory list (performance issue with many records)
4. Base64 image uploads have size limitations
5. Browser compatibility not fully tested

## Dependencies

### Backend Key Packages
- express: ^5.1.0
- mysql2: ^3.14.0
- bcrypt: ^5.1.1
- jsonwebtoken: ^9.0.2
- cloudinary: ^1.41.3
- multer: ^1.4.5-lts.2
- @xenova/transformers: ^2.17.2
- dotenv: ^16.4.7
- cors: ^2.8.5

### Frontend Key Packages
- react: ^18.x
- react-router-dom: ^6.x
- axios: ^1.x

## Documentation Files

1. **SETUP_INSTRUCTIONS.md** - Complete setup guide
2. **API_TESTING_GUIDE.md** - API endpoint testing
3. **PROJECT_SUMMARY.md** - This file
4. **README.md** - Project overview

## License

This project is developed as a thesis project for Girumdom.

## Contributors

Development Team: Your Name/Team Name

## Contact

For support or questions, please contact the development team.

---

**Last Updated**: December 2024
**Version**: 1.0.0
