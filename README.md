# Blog API

## Description

A RESTful backend API for a blogging platform built with Node.js, Express, and MongoDB. It handles user authentication, blog post management, commenting, and role-based access control so only post authors or administrators can modify or remove posts.

## API Capabilities & Endpoints

*(Note: Routes are relative to their mounted base paths, such as `/users` and `/posts`.)*

### Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user account |
| `POST` | `/login` | Public | Authenticate a user and return a JWT |

### Posts

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/add-post` | Authenticated | Create a new blog post |
| `GET` | `/all` | Authenticated | Retrieve all blog posts |
| `GET` | `/:id` | Authenticated | Retrieve a single blog post by ID |
| `PATCH` | `/update/:id` | Owner or Admin | Update an existing blog post |
| `DELETE` | `/delete/:id` | Owner or Admin | Delete a blog post |

### Comments

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `PATCH` | `/addComment/:id` | Authenticated | Add a comment to a specific blog post |

## Placeholder Credentials

Replace these placeholder values with your actual test or seeded accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@mail.com` | `admin123` |
| **User** | `user@mail.com` | `password` |

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JSON Web Tokens (JWT)