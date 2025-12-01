# Girumdom Web Application - Setup Instructions

This document provides comprehensive instructions for setting up and running the Girumdom web application.

## Project Structure

```
project/
├── Backend/              # Node.js + Express backend
│   ├── api/
│   │   ├── connections/  # Database models and queries
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Authentication and permissions
│   │   └── utils/        # Utility functions (TTS, etc.)
│   ├── server.js         # Main Express entry point
│   ├── package.json
│   └── .env             # Environment variables
│
└── frontend/            # React web application
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── contexts/    # React contexts (Auth)
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   └── styles/      # CSS files
    ├── package.json
    └── .env            # Frontend environment variables
```

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8 or higher) - [Download](https://www.mysql.com/downloads/)
3. **npm** (comes with Node.js)

## Backend Setup

### Step 1: Database Setup

1. Start your MySQL server

2. Create the database:
```bash
mysql -u root -p
CREATE DATABASE girumdom;
exit;
```

3. Import the database schema:
```bash
cd Backend
mysql -u root -p girumdom < girumdom_db.sql
```

### Step 2: Install Backend Dependencies

```bash
cd Backend
npm install
```

This will install all required packages including:
- express
- mysql2
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)
- cloudinary (for image storage)
- multer (for file uploads)
- @xenova/transformers (for TTS)
- and other dependencies

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and update with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=girumdom
DB_PORT=3306

JWT_SECRET=your-secret-key-change-this
```

3. If using Cloudinary for image uploads, add your Cloudinary credentials:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Add date_of_event Column (if not exists)

Run this SQL command to add the date_of_event column to the MEMORY table:

```sql
ALTER TABLE MEMORY ADD COLUMN date_of_event DATE NULL;
```

### Step 5: Start the Backend Server

```bash
cd Backend
node server.js
```

The backend server will start on **http://localhost:3000**

You should see:
```
Database connection successful
Server is running on port 3000
```

## Frontend Setup

### Step 1: Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

This installs:
- react
- react-router-dom
- axios
- and other React dependencies

### Step 2: Configure Frontend Environment

The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

If your backend is running on a different port, update this URL.

### Step 3: Start the Frontend Development Server

```bash
cd frontend
npm start
```

The React app will start on **http://localhost:3001** (or 3000 if available)

Your browser should automatically open to the login page.

## Using the Application

### Initial Setup

1. **Register a Main User**
   - Navigate to http://localhost:3001
   - Click "Register here"
   - Fill in the registration form
   - Select "Main User" as account type
   - Click Register

2. **Login**
   - Enter your email and password
   - Click Login
   - You'll be redirected to the dashboard

### Main Features

#### Memories
- **Create**: Click "Add Memory" button
- **Edit**: Click "Edit" on any memory card (if you have permission)
- **Delete**: Click "Delete" on any memory card (Main users only)
- **View**: Click "Expand" to see full memory details, images, and audio

#### Reminders
- **Create**: Click "Add Reminder" button in the sidebar
- **Complete**: Click the checkmark button
- **Delete**: Click the × button

#### Collaborations
- View your collaborations in the sidebar
- Shows your role (owner, editor, viewer)

#### Text-to-Speech (TTS)
- When viewing an expanded memory, scroll to the audio section
- Click "Generate Audio" to create narration
- Click "Play" to listen
- Click "Download" to save the audio file

### Permission System

#### Main Users Can:
- Create, edit, and delete their own memories
- Create and manage reminders
- Upload images
- Create collaborations
- Generate TTS audio

#### Assistant Users Can:
- Access is controlled by the main user via the ASSISTANT_PERMISSION table
- By default: can create memories and reminders
- Cannot delete unless granted permission
- Cannot edit unless granted permission

To grant permissions, update the ASSISTANT_PERMISSION table directly in MySQL:

```sql
INSERT INTO ASSISTANT_PERMISSION
(main_user_id, assistant_user_id, can_create_memory, can_edit_memory, can_delete_memory, can_create_reminder, can_upload_media)
VALUES (1, 2, 1, 1, 0, 1, 1);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Memories
- `GET /api/memory` - Get all memories
- `GET /api/memory/user` - Get authenticated user's memories
- `GET /api/memory/:id` - Get single memory
- `POST /api/memory` - Create memory (requires auth + permission)
- `PUT /api/memory/:id` - Update memory (requires auth + permission)
- `DELETE /api/memory/:id` - Delete memory (requires auth + permission)

### Reminders
- `GET /api/reminder/user` - Get user's reminders
- `GET /api/reminder/upcoming?days=7` - Get upcoming reminders
- `POST /api/reminder` - Create reminder
- `PUT /api/reminder/:id` - Update reminder
- `PATCH /api/reminder/:id/complete` - Mark reminder complete
- `DELETE /api/reminder/:id` - Delete reminder

### Collaborations
- `GET /api/collaboration/user` - Get user's collaborations
- `GET /api/collaboration/:id` - Get collaboration details
- `GET /api/collaboration/:id/members` - Get collaboration members
- `GET /api/collaboration/:id/memories` - Get collaboration memories
- `POST /api/collaboration` - Create collaboration
- `PUT /api/collaboration/:id` - Update collaboration
- `DELETE /api/collaboration/:id` - Delete collaboration

### Images
- `GET /api/images/memory/:memory_id` - Get memory images
- `POST /api/images` - Upload image (multipart/form-data)
- `POST /api/images/base64` - Upload base64 image
- `DELETE /api/images/:id` - Delete image

### Text-to-Speech
- `POST /api/tts` - Generate TTS audio
- `GET /api/tts/:memory_id` - Get TTS audio URL

## Troubleshooting

### Backend Issues

**Database connection failed**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure girumdom database exists

**JWT_SECRET error**
- Make sure JWT_SECRET is set in `.env`
- Use a strong random string

**Port already in use**
- Change PORT in server.js or kill the process using port 3000

### Frontend Issues

**Cannot connect to backend**
- Verify backend is running on port 3000
- Check REACT_APP_API_URL in frontend/.env

**CORS errors**
- Backend already has CORS enabled
- Ensure you're using the correct API URL

**Module not found errors**
- Run `npm install` in the frontend directory
- Delete node_modules and run `npm install` again

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use a strong JWT_SECRET
3. Use environment variables for all secrets
4. Set up proper MySQL user with limited permissions
5. Enable HTTPS
6. Set up proper logging

### Frontend
1. Run `npm run build` in frontend directory
2. Serve the build folder with a static file server
3. Update REACT_APP_API_URL to production backend URL
4. Enable HTTPS

## Additional Notes

- The TTS feature uses the facebook/mms-tts-tgl model for Tagalog language
- Images are stored in Cloudinary (configure credentials in .env)
- Audio files are also stored in Cloudinary
- Assistant users must be linked to a main user via main_user_id

## Support

For issues or questions, please refer to the code documentation or contact the development team.
