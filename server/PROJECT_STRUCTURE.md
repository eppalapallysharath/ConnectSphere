# ConnectSphere - Project Structure & File Organization

## 📂 Complete Project Structure

```
ConnectSphere/
├── server/
│   ├── config/
│   │   ├── cloudinary.js        # Cloudinary configuration
│   │   ├── db.js                # MongoDB connection
│   │   └── multer.js            # Multer file upload configuration
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── postsController.js   # Post CRUD operations
│   │   ├── commentsController.js # Comment operations
│   │   ├── usersController.js   # User profile management
│   │   └── adminController.js   # Admin operations
│   │
│   ├── models/
│   │   ├── userModel.js         # User schema
│   │   ├── postsModel.js        # Post schema
│   │   └── commentModel.js      # Comment schema
│   │
│   ├── Routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── postRoutes.js        # Post endpoints
│   │   ├── commentsRoutes.js    # Comment deletion endpoint
│   │   ├── likesRoutes.js       # Like functionality routes
│   │   ├── usersRoutes.js       # User management routes
│   │   └── adminRoutes.js       # Admin management routes
│   │
│   ├── middlewares/
│   │   ├── auth.js              # Authentication & Authorization middleware
│   │   ├── Error.js             # Error handling middleware
│   │   └── validationMiddleware.js # Express-validator middleware
│   │
│   ├── validations/
│   │   ├── authValidations.js   # Auth input validations
│   │   ├── postValidations.js   # Post input validations
│   │   └── usersValidations.js  # User input validations
│   │
│   ├── utils/
│   │   ├── fileupload.js        # File upload helper
│   │   └── users.js             # JWT & hash utilities
│   │
│   ├── uploads/                 # Temporary file storage
│   │
│   ├── server.js                # Express app setup & route mounting
│   ├── package.json             # Dependencies
│   ├── .env.example             # Environment variables template
│   ├── API_DOCUMENTATION.md     # Complete API reference
│   ├── QUICK_START.md           # Getting started guide
│   └── IMPLEMENTATION_SUMMARY.md # What was implemented
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│        Frontend (React)             │
│   (Will be in separate folder)      │
└──────────────────┬──────────────────┘
                   │ (HTTP Requests)
                   ▼
┌─────────────────────────────────────┐
│        Express Server               │
│         (server.js)                 │
│                                     │
│  ├─ Routes (Route Handlers)         │
│  │  ├─ authRoutes                   │
│  │  ├─ postRoutes                   │
│  │  ├─ usersRoutes                  │
│  │  ├─ commentsRoutes               │
│  │  ├─ likesRoutes                  │
│  │  └─ adminRoutes                  │
│  │                                  │
│  ├─ Controllers (Business Logic)    │
│  │  ├─ authController               │
│  │  ├─ postsController              │
│  │  ├─ usersController              │
│  │  ├─ commentsController           │
│  │  └─ adminController              │
│  │                                  │
│  ├─ Middlewares                     │
│  │  ├─ authentication               │
│  │  ├─ authorization                │
│  │  ├─ validation                   │
│  │  └─ errorHandler                 │
│  │                                  │
│  └─ Validations                     │
│     ├─ authValidations              │
│     ├─ postValidations              │
│     └─ usersValidations             │
│                                     │
└──────────────────┬──────────────────┘
        ┌──────────┴──────────┐
        ▼                     ▼
    ┌──────────┐       ┌─────────────┐
    │ MongoDB  │       │ Cloudinary  │
    │  Atlas   │       │  (Images)   │
    └──────────┘       └─────────────┘
```

---

## 📚 File-by-File Breakdown

### Controllers (Business Logic Layer)

#### `authController.js`
**Functions:**
- `register()` - Create new user account
- `login()` - Authenticate user
- `me()` - Get current user info
- `logout()` - Logout user
- `profile()` - Legacy profile endpoint

**Responsibilities:**
- User registration with validation
- Password hashing
- JWT token generation
- Login verification

---

#### `postsController.js`
**Functions:**
- `createPosts()` - Create new post with image
- `getAllPosts()` - Fetch all posts with pagination
- `getSinglePost()` - Get specific post details
- `getMyOwnPosts()` - Get current user's posts
- `updatePost()` - Modify post content/image
- `deletePost()` - Remove post and comments
- `likePost()` - Toggle like on post

**Responsibilities:**
- Post CRUD operations
- Image upload to Cloudinary
- Like/unlike functionality
- Comment count tracking

---

#### `commentsController.js`
**Functions:**
- `addComment()` - Add comment to post
- `getComments()` - Fetch comments with pagination
- `deleteComment()` - Remove comment (owner or admin)

**Responsibilities:**
- Comment management
- Proper authorization checking
- Comment count updates

---

#### `usersController.js`
**Functions:**
- `getUserProfile()` - Get user details
- `updateUserProfile()` - Update name, bio, profile picture
- `getAllUsers()` - Admin endpoint for all users

**Responsibilities:**
- Profile management
- Image upload to Cloudinary
- User data retrieval

---

#### `adminController.js`
**Functions:**
- `blockUser()` - Block a user account
- `unblockUser()` - Unblock user
- `deletePost()` - Admin delete any post
- `deleteComment()` - Admin delete any comment
- `getAllPosts()` - View all posts
- `getAnalytics()` - Get platform statistics

**Responsibilities:**
- Content moderation
- User management
- Platform analytics

---

### Models (Data Layer)

#### `userModel.js`
```javascript
{
  name: String (required, trimmed),
  email: String (unique, required, trimmed),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  profile_pic: {
    file_name: String,
    url: String
  },
  bio: String,
  isBlocked: Boolean (default: false),
  timestamps: true
}
```

#### `postsModel.js`
```javascript
{
  user: ObjectId (ref: User, required),
  content: String (required),
  file: {
    name: String (required),
    url: String (required)
  },
  likes: [ObjectId] (array of User ids),
  timestamps: true
}
```

#### `commentModel.js`
```javascript
{
  post: ObjectId (ref: Post, required),
  user: ObjectId (ref: User, required),
  text: String (required, trimmed),
  timestamps: true
}
```

---

### Routes (API Endpoints)

#### `authRoutes.js`
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `POST /logout` - Logout
- `GET /profile` - Legacy profile endpoint (removed in favor of /me)

#### `postRoutes.js`
- `POST /` - Create post
- `GET /` - Get all posts
- `GET /myPosts` - Get user's posts
- `GET /:id` - Get single post
- `PUT /:id` - Update post
- `DELETE /:id` - Delete post
- `PUT /:id/like` - Like/unlike post
- `POST /:id/comment` - Add comment
- `GET /:id/comments` - Get comments

#### `usersRoutes.js`
- `GET /:id` - Get user profile
- `PUT /update` - Update profile
- `GET /` - Get all users (admin)

#### `commentsRoutes.js`
- `DELETE /:id` - Delete comment

#### `likesRoutes.js`
- This router is included but comment/post operations handle likes within their routes

#### `adminRoutes.js`
- `PUT /users/block/:id` - Block user
- `PUT /users/unblock/:id` - Unblock user
- `DELETE /posts/:id` - Delete post
- `DELETE /comments/:id` - Delete comment
- `GET /posts` - View all posts
- `GET /analytics` - Get stats

---

### Middlewares (Request Processing)

#### `auth.js`
**Exports:**
- `authentication()` - Verify JWT token and attach user to request
- `authorization(...roles)` - Check if user has required role

**Usage:**
```javascript
// Single role check
router.get("/admin-route", authentication, authorization("admin"), handler)

// Multiple roles
router.get("/user-route", authentication, authorization("user", "admin"), handler)
```

#### `Error.js`
**Exports:**
- `errorMiddleware()` - Global error handler

**Catches:**
- Uncaught errors
- Validation errors
- Database errors

#### `validationMiddleware.js`
**Exports:**
- `validation()` - Express-validator error formatter

**Validates:**
- Request body
- URL parameters
- Query parameters
- Headers

---

### Validations (Input Validation Rules)

#### `authValidations.js`
- `registerValidationsChecks` - Name, email, password validation
- `loginChecks` - Email, password validation
- `profileChecks` - Authorization header validation
- `tokenCheck` - Token presence validation

#### `postValidations.js`
- `createPostCheck` - Content length, file required
- `updatePostCheck` - Optional content update
- `addCommentCheck` - Comment text length
- `postIdValidation` - MongoDB ObjectId validation
- `commentIdValidation` - Comment ID validation

#### `usersValidations.js`
- `updateUserProfileCheck` - Name, bio validation
- `userIdValidation` - User ID validation
- `paginationValidation` - Page/limit validation

---

### Utilities (Helper Functions)

#### `users.js`
- `generateHash()` - Hash password with bcryptjs
- `generateToken()` - Create JWT token
- `decodedToken()` - Verify and decode JWT

#### `fileupload.js`
- `fileUpload()` - Upload file to Cloudinary

---

### Configuration Files

#### `cloudinary.js`
- Cloudinary API configuration
- Exports cloudinary instance

#### `db.js`
- MongoDB connection setup
- Connection error handling

#### `multer.js`
- File upload configuration
- File size limits
- Destination folder setup
- File naming

---

## 🔄 Data Flow Examples

### Creating a Post
1. **Frontend** → POST /api/v1/posts with multipart/form-data
2. **Multer** → Saves file temporarily
3. **Validation** → Checks content and file
4. **Authentication** → Verifies JWT token
5. **Authorization** → Checks user or admin role
6. **Controller** → 
   - Uploads file to Cloudinary
   - Deletes temporary file
   - Creates post in MongoDB
   - Populates user reference
7. **Response** → Returns created post data

### Adding a Comment
1. **Frontend** → POST /api/v1/posts/:id/comment with JSON body
2. **Validation** → Checks comment text length
3. **Authentication** → Verifies JWT token
4. **Authorization** → Checks user or admin role
5. **Controller** →
   - Verifies post exists
   - Creates comment in MongoDB
   - Populates user reference
6. **Response** → Returns comment data

### Admin Blocking a User
1. **Frontend** → PUT /api/v1/admin/users/block/:id with admin token
2. **Authentication** → Verifies JWT token
3. **Authorization** → Checks user has "admin" role
4. **Controller** →
   - Finds user
   - Sets isBlocked = true
   - Saves to database
5. **Response** → Returns updated user data

---

## 🚀 Database Relationships

```
User (1) ──────────────────────── (Many) Post
         │ createdBy              
         │
         └─── (1) ────────────────── (Many) Comment
              │ createdBy

Post (1) ────────────────────────── (Many) Like
        │                          (stored as array in Post.likes)
        │
        └─── (1) ────────────────── (Many) Comment
             │ on
```

---

## 📊 Error Handling Flow

```
Controller Error
       ↓
Try-Catch Block
       ↓
Check Error Type
       ├─ Validation Error → 422
       ├─ Not Found → 404
       ├─ Unauthorized → 401
       ├─ Forbidden → 403
       └─ Server Error → 500
       ↓
Return Standardized Response
```

---

## 🔐 Security Layers

1. **Input Validation** - Express-validator
2. **Authentication** - JWT tokens
3. **Authorization** - Role checking
4. **Password Hashing** - bcryptjs
5. **User Blocking** - isBlocked flag
6. **Ownership Verification** - User ID comparison
7. **Secure File Upload** - Cloudinary
8. **Error Messages** - No sensitive data leaked

---

## 📈 Scalability Considerations

- **Pagination** - All list endpoints support it
- **Indexing** - MongoDB indexes on email, createdAt
- **Field Selection** - Selective field retrieval
- **Async Operations** - All I/O operations are async
- **Error Handling** - Prevents server crashes
- **CDN** - Cloudinary provides image CDN

---

**Happy coding! 🎉**
