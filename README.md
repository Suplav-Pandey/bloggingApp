# Blogify API

A RESTful API for a blogging platform with user authentication, blog management, and commenting functionality.

---

## Features
- User Authentication: Register, login, logout, and profile management
- Blog Management: Create, read, update, and delete blog posts
- Comments: Add, edit, and delete comments on blogs
- Media Uploads: Support for image uploads (profile pictures and blog cover images)
- Input Validation: Comprehensive validation for all data inputs
- JWT Authentication: Secure token-based authentication with cookies

---

## User Routes
All user-related routes are prefixed with `/users`.

### 1. User Registration
- `POST /users/register`
- Registers a new user.
- **Body:**
  ```json
  {
    "username": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Success (201):**
  ```json
  { "msg": "user registered successfully" }
  ```
- **Error (400):**
  ```json
  { "error": "..." } // or array of validation errors
  ```

### 2. User Login
- `POST /users/login`
- Logs in an existing user.
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Success (200):**
  ```json
  { "msg": "user logined successfully" }
  ```
- **Error (400):**
  ```json
  { "error": "email or password is incorrect" }
  ```

### 3. User Logout
- `POST /users/logout`
- Logs out the current user by clearing the token.
- **Success (200):**
  ```json
  { "msg": "logged out successfully" }
  ```
- **Error (400):**
  ```json
  { "error": "you are not logged in" }
  ```

### 4. View User Profile
- `GET /users/profile`
- Retrieves the profile of the currently logged-in user.
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
- Updates the profile of the currently logged-in user.
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
- Deletes the account of the currently logged-in user.
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
- Lists all blogs (without their body content).
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
- View a single blog by its ID.
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
- Lists all blogs created by the logged-in user (without their body content).
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
- Creates a new blog for the logged-in user.
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
- Edits an existing blog (only by the owner).
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
- Deletes a blog (only by the owner).
- **Success (200):**
  ```json
  { "msg": "blog deleted successfully" }
  ```
- **Error (401/403/400):**
  ```json
  { "error": "Error message" }
  ```

---

## Comment Routes
All comment-related routes are prefixed with `/comments`.

### 1. List Comments for a Blog
- `GET /comments/listBlogComments/:blogId`
- Lists all comments for a specific blog, populated with the owner's information.
- **Success (200):**
  ```json
  { "comments": [ ... ] }
  ```
  or
  ```json
  { "msg": "no comment on the blog, be the first one" }
  ```
- **Error (500):**
  ```json
  { "error": "An internal server error occurred" }
  ```

### 2. List a User's Comments
- `GET /comments/listUserComments`
- Lists all comments made by the currently logged-in user.
- **Success (200):**
  ```json
  { "comments": [ ... ] }
  ```
  or
  ```json
  { "msg": "you did not have any comment yet" }
  ```
- **Error (401/500):**
  ```json
  { "error": "Error message" }
  ```

### 3. Create a Comment
- `POST /comments/createComment/:blogId`
- Adds a new comment to a specific blog.
- **Body:**
  ```json
  {
    "body": "This is a great post!"
  }
  ```
- **Success (201):**
  ```json
  { "msg": "comment created successfully" }
  ```
- **Error (400/401/500):**
  ```json
  { "error": "Error message" } // or array of validation errors
  ```

### 4. Edit a Comment
- `POST /comments/editComment/:id`
- Edits an existing comment (only by the owner).
- **Body:**
  ```json
  {
    "body": "This is an updated comment."
  }
  ```
- **Success (200):**
  ```json
  { "msg": "comment edited successfully" }
  ```
- **Error (400/401/403/500):**
  ```json
  { "error": "Error message" } // or array of validation errors
  ```

### 5. Delete a Comment
- `POST /comments/deleteComment/:id`
- Deletes a comment (only by the owner).
- **Success (200):**
  ```json
  { "msg": "comment deleted successfully" }
  ```
- **Error (401/403/500):**
  ```json
  { "error": "Error message" }
  ```

---

## Other Functionalities
- **Media Uploads:** Images for blogs and profiles are uploaded to Cloudinary using Multer middleware. Supported formats: JPG, JPEG, PNG, WebP.
- **Input Validation:** All routes use express-validator for robust input validation.
- **Authentication:** JWT-based authentication with tokens stored in cookies. Protected routes use the `authe` middleware.
- **Data Deletion:** When a user is deleted, all their blogs and comments are also deleted. When a blog is deleted, all its comments are deleted. Images are removed from Cloudinary when their associated content is deleted.
- **Error Handling:** Validation errors and file upload errors are returned with clear messages and appropriate HTTP status codes.
