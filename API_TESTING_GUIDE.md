# API Testing Guide for Girumdom

This guide provides examples for testing all API endpoints using curl or tools like Postman.

## Base URL
```
http://localhost:3000/api
```

## Authentication Flow

### 1. Register a New User

**Main User Registration:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "user_type": "main"
  }'
```

**Assistant User Registration:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_assistant",
    "email": "jane@example.com",
    "password": "securepassword123",
    "user_type": "assistant",
    "main_user_id": 1
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "main",
    "main_user_id": null
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Save the token from the response for subsequent requests!**

### 3. Get Current User Info

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Memory Management

### Get All User's Memories

```bash
curl -X GET http://localhost:3000/api/memory/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Single Memory

```bash
curl -X GET http://localhost:3000/api/memory/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Memory

```bash
curl -X POST http://localhost:3000/api/memory \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Memory",
    "content": "This is a wonderful memory from my childhood...",
    "date_of_event": "2020-05-15"
  }'
```

**Response:**
```json
{
  "memory_id": 1,
  "title": "My First Memory",
  "content": "This is a wonderful memory from my childhood...",
  "date_of_event": "2020-05-15",
  "created_at": "2024-01-15T10:30:00.000Z",
  "user_id": 1,
  "creator_id": 1
}
```

### Update Memory

```bash
curl -X PUT http://localhost:3000/api/memory/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Memory Title",
    "content": "Updated content...",
    "date_of_event": "2020-05-16"
  }'
```

### Delete Memory

```bash
curl -X DELETE http://localhost:3000/api/memory/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Reminder Management

### Get User's Reminders

```bash
curl -X GET http://localhost:3000/api/reminder/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Upcoming Reminders (Next 7 Days)

```bash
curl -X GET "http://localhost:3000/api/reminder/upcoming?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Reminder

```bash
curl -X POST http://localhost:3000/api/reminder \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review old photos",
    "description": "Go through and organize family photos",
    "reminder_date": "2024-12-25T10:00:00",
    "memory_id": 1
  }'
```

### Update Reminder

```bash
curl -X PUT http://localhost:3000/api/reminder/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated reminder",
    "description": "New description",
    "reminder_date": "2024-12-26T14:00:00",
    "is_completed": 0
  }'
```

### Mark Reminder as Complete

```bash
curl -X PATCH http://localhost:3000/api/reminder/1/complete \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Reminder

```bash
curl -X DELETE http://localhost:3000/api/reminder/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Collaboration Management

### Get User's Collaborations

```bash
curl -X GET http://localhost:3000/api/collaboration/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Collaboration Details

```bash
curl -X GET http://localhost:3000/api/collaboration/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Collaboration

```bash
curl -X POST http://localhost:3000/api/collaboration \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Family Memories Project",
    "description": "Collecting and preserving our family history"
  }'
```

### Get Collaboration Members

```bash
curl -X GET http://localhost:3000/api/collaboration/1/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Member to Collaboration

```bash
curl -X POST http://localhost:3000/api/collaboration/1/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "role": "editor"
  }'
```

### Get Collaboration Memories

```bash
curl -X GET http://localhost:3000/api/collaboration/1/memories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Memory to Collaboration

```bash
curl -X POST http://localhost:3000/api/collaboration/1/memories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "memory_id": 1
  }'
```

---

## Image Upload

### Upload Image (Base64)

```bash
curl -X POST http://localhost:3000/api/images/base64 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "memory_id": 1,
    "filename": "family_photo.jpg"
  }'
```

### Get Images for Memory

```bash
curl -X GET http://localhost:3000/api/images/memory/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Image

```bash
curl -X DELETE http://localhost:3000/api/images/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Text-to-Speech (TTS)

### Generate TTS Audio for Memory

```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Kamusta, ito ay isang alaala mula sa aking kabataan.",
    "memory_id": 1,
    "user_id": 1
  }'
```

**Response:**
```
https://res.cloudinary.com/your-cloud/video/upload/v123456/tts_audio/audio_file.wav
```

### Get TTS Audio URL for Memory

```bash
curl -X GET http://localhost:3000/api/tts/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/your-cloud/video/upload/v123456/tts_audio/audio_file.wav"
}
```

---

## Storyteller Management

### Get All Storytellers for User

```bash
curl -X GET http://localhost:3000/api/storyteller/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Storyteller

```bash
curl -X POST http://localhost:3000/api/storyteller \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lola Maria",
    "description": "My grandmother who tells the best stories",
    "user_id": 1
  }'
```

### Get Memories Associated with Storyteller

```bash
curl -X GET http://localhost:3000/api/storyteller-memory/storyteller/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Associate Memory with Storyteller

```bash
curl -X POST http://localhost:3000/api/storyteller-memory \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "storyteller_id": 1,
    "memory_id": 1
  }'
```

---

## Testing Permission System

### 1. Create Assistant User
Register an assistant user linked to main user (ID: 1):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "assistant_user",
    "email": "assistant@example.com",
    "password": "password123",
    "user_type": "assistant",
    "main_user_id": 1
  }'
```

### 2. Set Permissions (Direct SQL)
Run this in MySQL to grant specific permissions:

```sql
INSERT INTO ASSISTANT_PERMISSION
(main_user_id, assistant_user_id, can_create_memory, can_edit_memory, can_delete_memory, can_create_reminder, can_upload_media)
VALUES (1, 2, 1, 1, 0, 1, 0);
```

### 3. Test Permissions
Try creating a memory with the assistant token:

```bash
curl -X POST http://localhost:3000/api/memory \
  -H "Authorization: Bearer ASSISTANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Memory by Assistant",
    "content": "Testing permissions..."
  }'
```

Try deleting (should fail if can_delete_memory = 0):

```bash
curl -X DELETE http://localhost:3000/api/memory/1 \
  -H "Authorization: Bearer ASSISTANT_TOKEN"
```

**Expected response:**
```json
{
  "error": "Permission denied",
  "message": "You do not have permission to delete memory"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied",
  "message": "You do not have permission to create memory"
}
```

### 404 Not Found
```json
{
  "error": "Memory not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to create memory"
}
```

---

## Postman Collection

You can import these endpoints into Postman:

1. Create a new Collection named "Girumdom API"
2. Add an environment variable `TOKEN` for the JWT token
3. Add an environment variable `BASE_URL` = `http://localhost:3000/api`
4. Use `{{BASE_URL}}` and `Authorization: Bearer {{TOKEN}}` in requests

---

## Testing Workflow

1. **Register** a main user
2. **Login** and save the token
3. **Create** a memory
4. **Upload** an image to the memory
5. **Generate** TTS audio for the memory
6. **Create** a reminder for the memory
7. **Create** a collaboration
8. **Add** the memory to the collaboration
9. **Register** an assistant user
10. **Test** permission restrictions with assistant token

---

## Tips

- Always include the `Authorization: Bearer TOKEN` header for protected endpoints
- Tokens expire after 24 hours by default
- Date format: ISO 8601 (e.g., "2024-12-25T10:00:00")
- Images should be base64 encoded with data URI format
- TTS generation may take a few seconds to process
