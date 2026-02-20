# ConnectSphere API Documentation

## Base URL
```
http://localhost:PORT/api/v1
```

---

## 🔐 Authentication APIs

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65ab12345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65ab12345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

---

### 3. Get Current User (Me)
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User details fetched successfully",
  "data": {
    "id": "65ab12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "bio": "I love coding",
    "profile_pic": {
      "file_name": "profile.jpg",
      "url": "https://cloudinary.com/..."
    },
    "isBlocked": false,
    "createdAt": "2026-02-14T10:00:00Z"
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful"
}
```

---

## 📝 Post APIs

### 1. Create Post
**POST** `/posts`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
content: "My first post"
image/video: <file>
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": "789xyz",
      "content": "My first post",
      "file": {
        "url": "https://cloudinary.com/abc.jpg"
      },
      "user": {
        "id": "65ab12345",
        "name": "John Doe"
      },
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2026-02-14T10:00:00Z"
    }
  }
}
```

---

### 2. Get All Posts (Paginated)
**GET** `/posts?page=1&limit=10`

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [
      {
        "id": "123",
        "content": "Hello world",
        "file": {
          "url": "https://cloudinary.com/..."
        },
        "user": {
          "id": "u123",
          "name": "Sharath"
        },
        "likesCount": 10,
        "commentsCount": 2,
        "createdAt": "2026-02-14T10:00:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalRecords": 120,
    "totalPages": 12
  }
}
```

---

### 3. Get Single Post
**GET** `/posts/:id`

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Post fetched successfully",
  "data": {
    "post": {
      "id": "123",
      "content": "Hello world",
      "file": {
        "url": "https://cloudinary.com/..."
      },
      "user": {
        "id": "u123",
        "name": "Sharath"
      },
      "likesCount": 10,
      "commentsCount": 2,
      "createdAt": "2026-02-14T10:00:00Z",
      "updatedAt": "2026-02-14T11:00:00Z"
    }
  }
}
```

---

### 4. Get My Own Posts
**GET** `/posts/myPosts?page=1&limit=10`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [...]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalRecords": 5,
    "totalPages": 1
  }
}
```

---

### 5. Update Post
**PUT** `/posts/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
content: "Updated post content"
image/video: <optional file>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Post updated successfully",
  "data": {
    "post": {...}
  }
}
```

---

### 6. Delete Post
**DELETE** `/posts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Post deleted successfully"
}
```

---

## ❤️ Like APIs

### 1. Like/Unlike Post
**PUT** `/posts/:id/like`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Post liked successfully",
  "data": {
    "post": {
      "id": "123",
      "likesCount": 11,
      "isLiked": true
    }
  }
}
```

---

## 💬 Comment APIs

### 1. Add Comment to Post
**POST** `/posts/:id/comment`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Great post!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "id": "c123",
      "text": "Great post!",
      "user": {
        "id": "u123",
        "name": "Sharath"
      },
      "createdAt": "2026-02-14T10:00:00Z"
    }
  }
}
```

---

### 2. Get All Comments for a Post
**GET** `/posts/:id/comments?page=1&limit=10`

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comments fetched successfully",
  "data": {
    "comments": [
      {
        "id": "c123",
        "text": "Great post!",
        "user": {
          "id": "u123",
          "name": "Sharath"
        },
        "createdAt": "2026-02-14T10:00:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalRecords": 5,
    "totalPages": 1
  }
}
```

---

### 3. Delete Comment
**DELETE** `/posts/comment/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comment deleted successfully"
}
```

---

## 👤 User APIs

### 1. Get User Profile
**GET** `/users/:id`

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile fetched successfully",
  "data": {
    "id": "65ab12345",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "I love coding",
    "role": "user",
    "profile_pic": {
      "file_name": "profile.jpg",
      "url": "https://cloudinary.com/..."
    },
    "createdAt": "2026-02-14T10:00:00Z"
  }
}
```

---

### 2. Update User Profile
**PUT** `/users/update`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: "John Updated"
bio: "Updated bio"
profilePic: <optional file>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "65ab12345",
    "name": "John Updated",
    "email": "john@example.com",
    "bio": "Updated bio",
    "profile_pic": {...}
  }
}
```

---

### 3. Get All Users (Admin Only)
**GET** `/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "id": "123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isBlocked": false,
        "profile_pic": {...},
        "createdAt": "2026-02-14T10:00:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalRecords": 50,
    "totalPages": 5
  }
}
```

---

## 👑 Admin APIs

### 1. Block User
**PUT** `/admin/users/block/:userId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User blocked successfully",
  "data": {
    "id": "65ab12345",
    "name": "John Doe",
    "email": "john@example.com",
    "isBlocked": true
  }
}
```

---

### 2. Unblock User
**PUT** `/admin/users/unblock/:userId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User unblocked successfully",
  "data": {
    "id": "65ab12345",
    "name": "John Doe",
    "email": "john@example.com",
    "isBlocked": false
  }
}
```

---

### 3. Delete Post (Admin)
**DELETE** `/admin/posts/:postId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Post deleted successfully"
}
```

---

### 4. Delete Comment (Admin)
**DELETE** `/admin/comments/:commentId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comment deleted successfully"
}
```

---

### 5. Get All Posts (Admin)
**GET** `/admin/posts?page=1&limit=10`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [...]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalRecords": 100,
    "totalPages": 10
  }
}
```

---

### 6. Get Analytics
**GET** `/admin/analytics`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Analytics fetched successfully",
  "data": {
    "analytics": {
      "totalUsers": 50,
      "totalPosts": 150,
      "totalComments": 500,
      "blockedUsers": 5,
      "activeUsers": 45
    }
  }
}
```

---

## Error Response Format

**All error responses follow this format:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT) |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (User already exists) |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## Authentication

All protected endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained from the `/auth/register` or `/auth/login` endpoints.

---

## Files Uploaded

- Images/Videos must be sent as `multipart/form-data`
- Supported field names: `image/video` (for posts), `profilePic` (for profile updates)
- Files are automatically uploaded to Cloudinary
