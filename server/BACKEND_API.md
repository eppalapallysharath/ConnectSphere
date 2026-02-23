# ConnectSphere Backend API Documentation

Welcome to the ConnectSphere API documentation. This document provides an overview of all available REST API endpoints.

**Base URL:** `http://localhost:8080` (Development)

---

## 🔐 Authentication APIs

**Base Path:** `/api/v1/auth`

| Method | Endpoint    | Summary                     | Auth Required    |
| :----- | :---------- | :-------------------------- | :--------------- |
| `POST` | `/register` | Register a new user         | No               |
| `POST` | `/login`    | Login and receive JWT token | No               |
| `GET`  | `/profile`  | Get current user profile    | Yes (User/Admin) |

---

## 📝 Post APIs

**Base Path:** `/api/v1/posts`

| Method   | Endpoint      | Summary                                 | Auth Required     |
| :------- | :------------ | :-------------------------------------- | :---------------- |
| `POST`   | `/createPost` | Create a new post (Multipart/form-data) | Yes (User/Admin)  |
| `GET`    | `/myPosts`    | Get current user's posts                | Yes (User/Admin)  |
| `GET`    | `/`           | Get all posts                           | No                |
| `GET`    | `/:id`        | Get single post details                 | No                |
| `PUT`    | `/:id`        | Update a post                           | Yes (Owner)       |
| `DELETE` | `/:id`        | Delete a post                           | Yes (Owner/Admin) |
| `PUT`    | `/:id/like`   | Like or Unlike a post                   | Yes (User)        |

---

## 👥 User APIs

**Base Path:** `/api/v1/users`

| Method | Endpoint  | Summary                                 | Auth Required    |
| :----- | :-------- | :-------------------------------------- | :--------------- |
| `GET`  | `/`       | Get all users                           | Yes (Admin)      |
| `PUT`  | `/update` | Update profile (Name, Bio, Profile Pic) | Yes (User/Admin) |
| `GET`  | `/:id`    | Get user profile by ID                  | No               |

---

## 💬 Comment APIs

**Base Path:** `/api/v1/comments`

| Method   | Endpoint        | Summary                     | Auth Required     |
| :------- | :-------------- | :-------------------------- | :---------------- |
| `POST`   | `/:id/comment`  | Add comment to a post       | Yes (User)        |
| `GET`    | `/:id/comments` | Get all comments for a post | No                |
| `DELETE` | `/:id`          | Delete a comment            | Yes (Owner/Admin) |

---

## ❤️ Like APIs

**Base Path:** `/api/v1/likes`

| Method | Endpoint   | Summary               | Auth Required    |
| :----- | :--------- | :-------------------- | :--------------- |
| `PUT`  | `/:postId` | Like or Unlike a post | Yes (User/Admin) |

---

## 🛠️ Admin APIs

**Base Path:** `/api/v1/admin`

| Method   | Endpoint             | Summary                    | Auth Required |
| :------- | :------------------- | :------------------------- | :------------ |
| `PUT`    | `/users/block/:id`   | Block a user               | Yes (Admin)   |
| `PUT`    | `/users/unblock/:id` | Unblock a user             | Yes (Admin)   |
| `DELETE` | `/posts/:id`         | Delete any post            | Yes (Admin)   |
| `DELETE` | `/comments/:id`      | Delete any comment         | Yes (Admin)   |
| `GET`    | `/posts`             | Get all posts (Admin view) | Yes (Admin)   |
| `GET`    | `/analytics`         | Get platform analytics     | Yes (Admin)   |

---

## 🛡️ Security

Most endpoints require a **Bearer Token**. Include the token in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

## 📜 Error Handling

Common responses include:

- `200 OK`: Success
- `201 Created`: Resource successfully created
- `401 Unauthorized`: Token missing or invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: API or Resource not found
- `409 Conflict`: Resource already exists
