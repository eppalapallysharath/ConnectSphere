# Frontend Integration Checklist - ConnectSphere API

## 🎯 Overview

This document provides a checklist for frontend developers integrating with the ConnectSphere API. It lists all endpoints organized by feature and indicates:
- ✅ Endpoint Status (Implemented/Ready)
- 📝 Required Parameters
- 🔐 Authentication Required
- 📊 Response Structure

---

## 🔐 Authentication Endpoints

### ✅ User Registration
```
POST /api/v1/auth/register
🔐 No authentication required
📝 Body: { name, email, password }
✨ Returns: user data + accessToken
```
**Todo:**
- [ ] Create registration form with validation
- [ ] Handle password strength requirements
- [ ] Store token securely (localStorage/sessionStorage)
- [ ] Redirect to login on success

---

### ✅ User Login
```
POST /api/v1/auth/login
🔐 No authentication required
📝 Body: { email, password }
✨ Returns: user data + accessToken
```
**Todo:**
- [ ] Create login form
- [ ] Add "Remember me" functionality
- [ ] Store token securely
- [ ] Handle login errors (blocked user, invalid credentials)
- [ ] Redirect to dashboard on success

---

### ✅ Get Current User
```
GET /api/v1/auth/me
🔐 ⭐ Authentication required
📝 Headers: { Authorization: "Bearer <token>" }
✨ Returns: Full user profile
```
**Todo:**
- [ ] Call on app initialization
- [ ] Store user data in global state (Redux/Context)
- [ ] Use for permission checks (user vs admin)
- [ ] Redirect to login if token expired

---

### ✅ Logout
```
POST /api/v1/auth/logout
🔐 ⭐ Authentication required
📝 Headers: { Authorization: "Bearer <token>" }
✨ Returns: { success: true, message: "Logout successful" }
```
**Todo:**
- [ ] Clear stored token
- [ ] Clear user data from state
- [ ] Redirect to login page
- [ ] Show logout confirmation

---

## 📝 Post Endpoints

### ✅ Create Post
```
POST /api/v1/posts
🔐 ⭐ Authentication required (user/admin)
📝 Body: FormData { content, image/video }
✨ Returns: Created post with metadata
```
**Todo:**
- [ ] Create post composition form
- [ ] Image preview before upload
- [ ] Character counter for content (max 200)
- [ ] Loading state while uploading
- [ ] Handle upload errors
- [ ] Refresh post feed after creation
- [ ] Show success notification

---

### ✅ Get All Posts
```
GET /api/v1/posts?page=1&limit=10
🔐 No authentication required
📝 Query: { page, limit }
✨ Returns: Array of posts + pagination metadata
```
**Todo:**
- [ ] Display posts in feed (newest first)
- [ ] Implement infinite scroll or pagination
- [ ] Load more posts on scroll
- [ ] Show "No posts" message when empty
- [ ] Display author info for each post
- [ ] Show like count
- [ ] Show comment count
- [ ] Display created date/time

---

### ✅ Get My Posts
```
GET /api/v1/posts/myPosts?page=1&limit=10
🔐 ⭐ Authentication required
📝 Query: { page, limit }
✨ Returns: User's posts with pagination
```
**Todo:**
- [ ] Create "My Posts" or "Profile" tab
- [ ] Display user's posts only
- [ ] Show edit/delete buttons on own posts
- [ ] Handle empty state

---

### ✅ Get Single Post
```
GET /api/v1/posts/:id
🔐 No authentication required
📝 Params: { id }
✨ Returns: Full post details
```
**Todo:**
- [ ] Create post detail/modal view
- [ ] Display all post information
- [ ] Show like count
- [ ] Show comment count
- [ ] Link to view full comments

---

### ✅ Update Post
```
PUT /api/v1/posts/:id
🔐 ⭐ Authentication required
📝 Body: FormData { content, image/video (optional) }
✨ Returns: Updated post
```
**Todo:**
- [ ] Create edit post form (pre-fill current content)
- [ ] Allow content and image updates
- [ ] Show edit button only on own posts
- [ ] Confirm before updating
- [ ] Show success notification
- [ ] Refresh post in feed

---

### ✅ Delete Post
```
DELETE /api/v1/posts/:id
🔐 ⭐ Authentication required
📝 Headers: { Authorization }
✨ Returns: { success: true }
```
**Todo:**
- [ ] Add delete button on own posts
- [ ] Show confirmation dialog
- [ ] Handle deletion errors
- [ ] Remove post from feed after deletion
- [ ] Show success notification

---

## ❤️ Like Endpoints

### ✅ Toggle Like
```
PUT /api/v1/posts/:id/like
🔐 ⭐ Authentication required
📝 Params: { id }
✨ Returns: { isLiked: boolean, likesCount }
```
**Todo:**
- [ ] Add like button on each post
- [ ] Show if current user liked it
- [ ] Update like count on toggle
- [ ] Change button style when liked (filled vs outline)
- [ ] Prevent double-clicking/race conditions
- [ ] Show animation on like

---

## 💬 Comment Endpoints

### ✅ Add Comment
```
POST /api/v1/posts/:id/comment
🔐 ⭐ Authentication required
📝 Body: { text }
✨ Returns: Created comment with user info
```
**Todo:**
- [ ] Add comment input field below posts
- [ ] Character limit: 1-500 characters
- [ ] Show character count
- [ ] Submit on Enter key (optional)
- [ ] Clear input after posting
- [ ] Add comment to list immediately (optimistic update)
- [ ] Show author avatar and name

---

### ✅ Get Comments
```
GET /api/v1/posts/:id/comments?page=1&limit=10
🔐 No authentication required
📝 Query: { page, limit }
✨ Returns: Array of comments with pagination
```
**Todo:**
- [ ] Display comments section below post
- [ ] Show "No comments" if empty
- [ ] Load/show more comments on demand
- [ ] Display in reverse chronological order (newest first)
- [ ] Show author info for each comment
- [ ] Show created time relative (e.g., "2 hours ago")

---

### ✅ Delete Comment
```
DELETE /api/v1/comments/:id
🔐 ⭐ Authentication required
📝 Headers: { Authorization }
✨ Returns: { success: true }
```
**Todo:**
- [ ] Show delete button only on own comments
- [ ] Or show admin can delete any comment
- [ ] Show confirmation before deleting
- [ ] Remove from display immediately
- [ ] Show success notification

---

## 👤 User Endpoints

### ✅ Get User Profile
```
GET /api/v1/users/:id
🔐 No authentication required
📝 Params: { id }
✨ Returns: User profile info
```
**Todo:**
- [ ] Create user profile page
- [ ] Display user info (name, bio, profile pic)
- [ ] Display user's posts count
- [ ] Display user's followers/following (if implemented)
- [ ] Show follow/unfollow button (if implementing social features)
- [ ] Handle "User not found" error

---

### ✅ Update User Profile
```
PUT /api/v1/users/update
🔐 ⭐ Authentication required
📝 Body: FormData { name (optional), bio (optional), profilePic (optional) }
✨ Returns: Updated user data
```
**Todo:**
- [ ] Create edit profile form
- [ ] Pre-fill current name and bio
- [ ] Show current profile picture
- [ ] Allow changing profile picture
- [ ] Validate input (name length, bio length)
- [ ] Show loading state while updating
- [ ] Show success notification
- [ ] Update displayed profile after change

---

### ✅ Get All Users (Admin)
```
GET /api/v1/users?page=1&limit=10
🔐 ⭐ Authentication required (admin only)
📝 Query: { page, limit }
✨ Returns: Array of users + pagination
```
**Todo:**
- [ ] Create admin user management page
- [ ] Display users in table/list
- [ ] Show user info (name, email, role, status)
- [ ] Show block status
- [ ] Add block/unblock buttons
- [ ] Implement pagination
- [ ] Add search/filter (optional enhancement)

---

## 👑 Admin Endpoints

### ✅ Block User
```
PUT /api/v1/admin/users/block/:id
🔐 ⭐ Authentication required (admin only)
📝 Params: { id }
✨ Returns: Updated user with { isBlocked: true }
```
**Todo:**
- [ ] Show in admin user management
- [ ] Add "Block" button for users
- [ ] Show confirmation dialog
- [ ] Update user status immediately
- [ ] Show success notification
- [ ] Blocked users cannot login

---

### ✅ Unblock User
```
PUT /api/v1/admin/users/unblock/:id
🔐 ⭐ Authentication required (admin only)
📝 Params: { id }
✨ Returns: Updated user with { isBlocked: false }
```
**Todo:**
- [ ] Show "Unblock" button for blocked users
- [ ] Confirm before unblocking
- [ ] Update user status immediately
- [ ] Show success notification

---

### ✅ Delete Post (Admin)
```
DELETE /api/v1/admin/posts/:id
🔐 ⭐ Authentication required (admin only)
📝 Params: { id }
✨ Returns: { success: true }
```
**Todo:**
- [ ] Create admin post moderation page
- [ ] Show all posts
- [ ] Add "Delete" button for any post
- [ ] Show post author info
- [ ] Confirm before deletion
- [ ] Show success notification

---

### ✅ Delete Comment (Admin)
```
DELETE /api/v1/admin/comments/:id
🔐 ⭐ Authentication required (admin only)
📝 Params: { id }
✨ Returns: { success: true }
```
**Todo:**
- [ ] Add comment moderation capability
- [ ] Show comments reported or flagged
- [ ] Add delete button
- [ ] Confirm before deletion
- [ ] Show success notification

---

### ✅ Get All Posts (Admin)
```
GET /api/v1/admin/posts?page=1&limit=10
🔐 ⭐ Authentication required (admin only)
📝 Query: { page, limit }
✨ Returns: Array of all posts + pagination
```
**Todo:**
- [ ] Create admin post moderation dashboard
- [ ] Display all posts with author info
- [ ] Show creation date
- [ ] Add filters (optional)
- [ ] Implement pagination
- [ ] Quick delete action

---

### ✅ Get Analytics
```
GET /api/v1/admin/analytics
🔐 ⭐ Authentication required (admin only)
📝 Headers: { Authorization }
✨ Returns: { totalUsers, totalPosts, totalComments, blockedUsers, activeUsers }
```
**Todo:**
- [ ] Create admin dashboard
- [ ] Display statistics:
  - [ ] Total users
  - [ ] Active users
  - [ ] Blocked users
  - [ ] Total posts
  - [ ] Total comments
- [ ] Show as cards/charts
- [ ] Update analytics on admin access

---

## 🛠️ Common Frontend Tasks

### Before Starting Development
- [ ] Ensure backend is running on PORT 5000
- [ ] Get API base URL: `http://localhost:5000/api/v1`
- [ ] Set up API client (Axios/Fetch)
- [ ] Create .env file with API URL

### For Each Feature
- [ ] Test endpoint with Postman first
- [ ] Create API helper functions
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success notifications
- [ ] Test with invalid inputs
- [ ] Test with expired tokens
- [ ] Test with unauthorized access

### Global Setup
- [ ] Create API client/service
- [ ] Set up state management (Redux/Context)
- [ ] Create authentication context
- [ ] Add token persistence
- [ ] Add token refresh logic
- [ ] Create error handling middleware
- [ ] Add loading indicators
- [ ] Add toast notifications

---

## 📋 Implementation Order (Recommended)

### Phase 1: Authentication
1. [ ] Register endpoint
2. [ ] Login endpoint
3. [ ] Auth context/state
4. [ ] Token storage & retrieval
5. [ ] Protected routes

### Phase 2: Feed & Posts
1. [ ] Get all posts (feed)
2. [ ] Create post endpoint
3. [ ] Like/unlike endpoint
4. [ ] Post display component
5. [ ] Create post modal/form

### Phase 3: Comments & Interactions
1. [ ] Get comments endpoint
2. [ ] Add comment endpoint
3. [ ] Delete comment endpoint
4. [ ] Comments display component
5. [ ] Comment input component

### Phase 4: User Features
1. [ ] Get current user endpoint
2. [ ] User profile page
3. [ ] Edit profile endpoint
4. [ ] Update profile form
5. [ ] Profile picture upload

### Phase 5: Admin Features
1. [ ] Admin dashboard
2. [ ] User management page
3. [ ] Block/unblock users
4. [ ] Post moderation
5. [ ] Analytics dashboard

---

## 🧪 Testing Checklist

### For Each Endpoint
- [ ] Test with valid input
- [ ] Test with missing fields
- [ ] Test with invalid data types
- [ ] Test without authentication (if required)
- [ ] Test with expired token
- [ ] Test with invalid token
- [ ] Test with wrong user ID/permissions
- [ ] Check response status codes
- [ ] Check response data structure
- [ ] Check error messages

---

## 🚀 Deployment Notes

- Ensure .env file is created with correct values
- Update API base URL for production
- Test all endpoints in production environment
- Monitor error logs
- Set up proper CORS configuration
- Use HTTPS in production
- Implement request logging
- Set up error tracking (Sentry, etc.)

---

## 📞 Common Issues & Solutions

### Authentication Issues
- **Token not persisting**: Check localStorage/storage mechanism
- **Silent logout**: Token expired, implement refresh token logic
- **Blocked user login**: Check error code ACCOUNT_BLOCKED

### Post/Comment Issues
- **Images not uploading**: Check file size, Cloudinary config
- **Empty feed**: Check pagination, ensure posts exist
- **Can't edit/delete own post**: Verify user ID matches, check token

### Admin Issues
- **Can't access admin endpoints**: Check user role is "admin"
- **Can't delete other's posts**: User role might be "user"
- **Analytics showing wrong numbers**: Check database directly

---

**Happy Frontend Development! 🎉**
