# Blogify API

This document provides a concise overview of the Blogify API endpoints, their functionalities, expected inputs, and possible outputs.

---

## User Routes

All user-related routes are prefixed with `/users`.

### 1. User Registration

- **Endpoint:** `POST /users/register`
- **Description:** Registers a new user.
- **Input (Request Body):**
  ```json
  {
    "username": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Output (Success Response):**
  - **Status:** `201`
  - **Body:**
    ```json
    {
      "msg": "user registered successfully"
    }
    ```
  - **Cookie:** Sets a `token` cookie.
- **Output (Error Response):**
  - **Status:** `400`
  - **Body (Validation Error):**
    ```json
    {
      "error": [
        {
          "type": "field",
          "value": "...",
          "msg": "...",
          "path": "...",
          "location": "body"
        }
      ]
    }
    ```
  - **Body (Other Error):**
    ```json
    {
      "error": "Error message"
    }
    ```

### 2. User Login

- **Endpoint:** `POST /users/login`
- **Description:** Logs in an existing user.
- **Input (Request Body):**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Output (Success Response):**
  - **Status:** `200`
  - **Body:**
    ```json
    {
      "msg": "user logined successfully"
    }
    ```
  - **Cookie:** Sets a `token` cookie.
- **Output (Error Response):**
  - **Status:** `400`
  - **Body:**
    ```json
    {
      "error": "email or password is incorrect"
    }
    ```

### 3. User Logout

- **Endpoint:** `POST /users/logout`
- **Description:** Logs out the current user by clearing the token.
- **Input:** None (Requires `token` cookie).
- **Output (Success Response):**
  - **Status:** `200`
  - **Body:**
    ```json
    {
      "msg": "logged out successfully"
    }
    ```
  - **Cookie:** Clears the `token` cookie.
- **Output (Error Response):**
  - **Status:** `400`
  - **Body:**
    ```json
    {
      "error": "you are not logged in"
    }
    ```

### 4. View User Profile

- **Endpoint:** `GET /users/profile`
- **Description:** Retrieves the profile of the currently logged-in user.
- **Input:** None (Requires `token` cookie).
- **Output (Success Response):**
  - **Status:** `200`
  - **Body:**
    ```json
    {
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com",
      "profileImgUrl": "/userProfile/default.png",
      "role": "user"
    }
    ```
- **Output (Error Response):**
  - **Status:** `401`
  - **Body:**
    ```json
    {
      "error": "invalid token"
    }
    ```

### 5. Edit User Profile

- **Endpoint:** `POST /users/profile`
- **Description:** Updates the profile of the currently logged-in user.
- **Input (Request Body):**
  - Any combination of the fields below.
  ```json
  {
    "username": {
        "firstname": "Johnny",
        "lastname": "Doer"
    },
    "password": "newpassword123",
    "profileImgUrl": "/new/image.png",
    "role": "admin"
  }
  ```
- **Output (Success Response):**
  - **Status:** `200`
  - **Body:**
    ```json
    {
      "msg": "user updated"
    }
    ```
- **Output (Error Response):**
  - **Status:** `400` (Validation error) or `401` (Invalid token).
  - **Body:**
    ```json
    {
      "error": "Error message"
    }
    ```

### 6. Delete User Account

- **Endpoint:** `POST /users/delete`
- **Description:** Deletes the account of the currently logged-in user.
- **Input:** None (Requires `token` cookie).
- **Output (Success Response):**
  - **Status:** `200`
  - **Body:**
    ```json
    {
      "msg": "user deleted successfully"
    }
    ```
- **Output (Error Response):**
  - **Status:** `401` (Invalid token) or `500` (Server error).
  - **Body:**
    ```json
    {
      "error": "Error message"
    }
    ```
