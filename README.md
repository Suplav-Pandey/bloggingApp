# Blogify API

This document provides a concise overview of the Blogify API endpoints, their functionalities, expected inputs, and possible outputs.

---

## User Routes

All user-related routes are prefixed with `/users`.

### 1. User Registration
- `POST /users/register`
- **Description:** Registers a new user.
- **Body:**
  ```json
  {
    "username": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Success (201):** Sets `token` cookie.
  ```json
  { "msg": "user registered successfully" }
  ```
- **Error (400):**
  ```json
  { "error": "..." } // or array of validation errors
  ```

### 2. User Login
- `POST /users/login`
- **Description:** Logs in an existing user.
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Success (200):** Sets `token` cookie.
  ```json
  { "msg": "user logined successfully" }
  ```
- **Error (400):**
  ```json
  { "error": "email or password is incorrect" }
  ```

### 3. User Logout
- `POST /users/logout`
- **Description:** Logs out the current user by clearing the token.
- **Auth:** Requires `token` cookie.
- **Success (200):** Clears `token` cookie.
  ```json
  { "msg": "logged out successfully" }
  ```
- **Error (400):**
  ```json
  { "error": "you are not logged in" }
  ```

### 4. View User Profile
- `GET /users/profile`
- **Description:** Retrieves the profile of the currently logged-in user.
- **Auth:** Requires `token` cookie.
- **Success (200):**
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "profileImgUrl": "/userProfile/default.png",
    "role": "user"
  }
  ```
- **Error (401):**
  ```json
  { "error": "invalid token" }
  ```

### 5. Edit User Profile
- `POST /users/profile`
- **Description:** Updates the profile of the currently logged-in user.
- **Auth:** Requires `token` cookie.
- **Body (Optional fields):**
  ```json
  {
    "username": { "firstname": "Johnny", "lastname": "Doer" },
    "password": "newpassword123",
    "profileImgUrl": "/new/image.png",
    "role": "admin"
  }
  ```
- **Success (200):**
  ```json
  { "msg": "user updated" }
  ```
- **Error (400/401):**
  ```json
  { "error": "Error message" }
  ```

### 6. Delete User Account
- `POST /users/delete`
- **Description:** Deletes the account of the currently logged-in user.
- **Auth:** Requires `token` cookie.
- **Success (200):**
  ```json
  { "msg": "user deleted successfully" }
  ```
- **Error (401/500):**
  ```json
  { "error": "Error message" }
  ```

---

## Blog Routes

All blog-related routes are prefixed with `/blogs`.

### 1. List All Blogs
- `GET /blogs/listAll`
- **Description:** Lists all blogs (without their body content).
- **Success (200):**
  ```json
  { "blogs": [ ... ] }
  ```
  or
  ```json
  { "msg": "no Blog created yet, be the first one" }
  ```
- **Error (500):**
  ```json
  { "error": "Error message" }
  ```

### 2. View Blog
- `GET /blogs/view/:id`
- **Description:** View a single blog by its ID.
- **Success (200):**
  ```json
  { "blog": { ... } }
  ```
- **Error (404/500):**
  ```json
  { "error": "Error message" }
  ```

### 3. List User's Blogs
- `GET /blogs/listUser`
- **Description:** Lists all blogs created by the logged-in user (without their body content).
- **Auth:** Requires `token` cookie or header.
- **Success (200):**
  ```json
  { "blogs": [ ... ] }
  ```
  or
  ```json
  { "msg": "you do not have any blog yet, create one" }
  ```
- **Error (401/500):**
  ```json
  { "error": "Error message" }
  ```

### 4. Create Blog
- `POST /blogs/create`
- **Description:** Creates a new blog for the logged-in user.
- **Auth:** Requires `token` cookie or header.
- **Body:**
  ```json
  {
    "title": "...",
    "desc": "...",
    "coverImgUrl": "...",
    "body": "..."
  }
  ```
- **Success (201):**
  ```json
  { "msg": "blog created successfully", "blog": { ... } }
  ```
- **Error (400/401):**
  ```json
  { "error": "Error message" } // or array of validation errors
  ```

### 5. Edit Blog
- `POST /blogs/edit/:id`
- **Description:** Edits an existing blog (only by the owner).
- **Auth:** Requires `token` cookie or header.
- **Body (Optional fields):**
  ```json
  {
    "title": "...",
    "desc": "...",
    "coverImgUrl": "...",
    "body": "..."
  }
  ```
- **Success (200):**
  ```json
  { "msg": "blog updated successfully" }
  ```
- **Error (400/401/403):**
  ```json
  { "error": "Error message" } // or array of validation errors
  ```

### 6. Delete Blog
- `POST /blogs/delete/:id`
- **Description:** Deletes a blog (only by the owner).
- **Auth:** Requires `token` cookie or header.
- **Success (200):**
  ```json
  { "msg": "blog deleted successfully" }
  ```
- **Error (401/403/400):**
  ```json
  { "error": "Error message" }
  ```
