# ConnectSphere API - Quick Start Guide

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your actual values
```

Required Environment Variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time (e.g., "7d")
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### 3. Start the Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`

---

## 📝 Testing the API

### Using Postman
1. Import the API endpoints from `API_DOCUMENTATION.md`
2. Create a collection with all endpoints
3. Use the examples provided in the documentation

### Example Request Flow

#### 1. Register a User
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### 2. Login
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response includes `accessToken` - save this for authenticated requests.

#### 3. Get Current User
```
GET http://localhost:5000/api/v1/auth/me
Authorization: Bearer <accessToken>
```

#### 4. Create a Post (with image)
```
POST http://localhost:5000/api/v1/posts
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Form Data:
- content: "My first post"
- image/video: <select image file>
```

#### 5. Get All Posts
```
GET http://localhost:5000/api/v1/posts?page=1&limit=10
```

#### 6. Like a Post
```
PUT http://localhost:5000/api/v1/posts/{postId}/like
Authorization: Bearer <accessToken>
```

#### 7. Add a Comment
```
POST http://localhost:5000/api/v1/posts/{postId}/comment
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "text": "Great post!"
}
```

#### 8. Delete a Comment
```
DELETE http://localhost:5000/api/v1/comments/{commentId}
Authorization: Bearer <accessToken>
```

---

## 👨‍💼 Admin Operations

### How to Create an Admin User

When a user registers, they get `role: "user"` by default. To create an admin:

1. Register a user normally
2. Using MongoDB/Database tool, update the user's role to "admin":
   ```bash
   db.users.findByIdAndUpdate(userId, { role: "admin" })
   ```

Or directly in MongoDB:
```javascript
db.users.updateOne(
  { _id: ObjectId("userId") },
  { $set: { role: "admin" } }
)
```

### Admin Endpoints

#### Block a User
```
PUT http://localhost:5000/api/v1/admin/users/block/{userId}
Authorization: Bearer <adminToken>
```

#### Unblock a User
```
PUT http://localhost:5000/api/v1/admin/users/unblock/{userId}
Authorization: Bearer <adminToken>
```

#### Get All Users (with pagination)
```
GET http://localhost:5000/api/v1/admin/users?page=1&limit=10
Authorization: Bearer <adminToken>
```

#### Delete Any Post
```
DELETE http://localhost:5000/api/v1/admin/posts/{postId}
Authorization: Bearer <adminToken>
```

#### Delete Any Comment
```
DELETE http://localhost:5000/api/v1/admin/comments/{commentId}
Authorization: Bearer <adminToken>
```

#### Get Analytics
```
GET http://localhost:5000/api/v1/admin/analytics
Authorization: Bearer <adminToken>
```

---

## 🔍 Common Issues & Solutions

### Issue: "ECONNREFUSED" when connecting to database
**Solution**: Make sure MongoDB is running and connection string is correct

### Issue: Cloudinary upload failing
**Solution**: Check Cloudinary credentials are correct in .env file

### Issue: JWT token expired
**Solution**: Get a new token by logging in again

### Issue: 403 Forbidden on admin routes
**Solution**: Make sure user has `role: "admin"` in the database

### Issue: File upload failing
**Solution**: 
- Check file size is reasonable
- Ensure multer middleware is properly configured
- Check that image/video field name matches in the form data

---

## 📊 Response Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User blocked or insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | User already exists |
| 422 | Validation Error | Invalid input format |
| 500 | Server Error | Internal server error |

---

## 🔒 Authentication Flow

1. User registers with email and password
2. Server returns JWT token
3. Client stores token (usually in localStorage or sessionStorage)
4. For protected requests, add token to Authorization header:
   ```
   Authorization: Bearer <token>
   ```
5. Server validates token and user information
6. If valid, request is processed; otherwise 401 is returned

---

## 📋 Required Body Field Examples

### Register/Login
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

### Create Post
```
Form Data:
- content: "Post text (min 3, max 200 chars)"
- image/video: [file]
```

### Update Post
```
Form Data:
- content: "Updated text (optional)"
- image/video: [file] (optional)
```

### Update User Profile
```
Form Data:
- name: "New Name (optional)"
- bio: "User bio (optional, max 500 chars)"
- profilePic: [file] (optional)
```

### Add Comment
```json
{
  "text": "Comment text (1-500 characters)"
}
```

---

## 🎯 API Base URL

```
http://localhost:5000/api/v1
```

All endpoints listed in this guide use this base URL.

---

## 💡 Best Practices

1. **Store Token Securely**: Save JWT tokens in httpOnly cookies or secure storage
2. **Validate Input**: Always validate data on the client-side before sending
3. **Error Handling**: Implement proper error handling for different status codes
4. **Pagination**: Always implement pagination for list endpoints
5. **Rate Limiting**: Implement rate limiting in production
6. **CORS**: Configure CORS properly for frontend-backend communication
7. **Image Optimization**: Use responsive images and proper sizing
8. **Refresh Tokens**: Implement refresh token mechanism for better security

---

## 📚 Additional Resources

- Full API Documentation: See `API_DOCUMENTATION.md`
- Implementation Details: See `IMPLEMENTATION_SUMMARY.md`
- Project Specification: Check the project document

---

## 🐛 Debugging Tips

1. **Check logs**: Look at server console for error messages
2. **Validate tokens**: Use JWT debugger (jwt.io) to decode tokens
3. **Test endpoints**: Use Postman/Insomnia to test each endpoint
4. **Check database**: Verify data is being saved correctly in MongoDB
5. **Cloudinary logs**: Check Cloudinary dashboard for upload issues

---

**Happy Coding! 🚀**
