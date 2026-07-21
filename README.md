# Task Management System

## Live Demo
- **Frontend**: https://tms-task-msr.vercel.app
- **Backend API**: https://task-management-system-agamisoft.onrender.com

**Test accounts:**
- **Admin**: `admin@example.com` / `Admin123!`
- **User**: `user@example.com` / `User123!`
### Overview
The Task Management System is a comprehensive full-stack application designed to help users organize projects and tasks effectively. It features a modern, responsive UI with robust Role-Based Access Control (RBAC), allowing regular users to manage their personal workspaces while providing administrators with system-wide oversight. Core features include secure authentication, full CRUD capabilities for projects and tasks, real-time debounced search, and status filtering.

### Tech Stack
**Frontend (client/)**:
- Next.js (v15.5.20)
- React & React DOM (v19.1.0)
- TailwindCSS (v4.0.0)
- Axios (v1.18.1)
- Lucide React (v1.25.0)

**Backend (server/)**:
- Express (v5.2.1)
- Prisma ORM (v7.8.0)
- PostgreSQL (pg v8.22.0)
- JSON Web Token (v9.0.3)
- Bcrypt.js (v3.0.3)
- Zod (v4.4.3)

### Installation
Follow these step-by-step instructions to get the application running locally from a fresh clone:

1. Clone the repository to your local machine.
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../client
   npm install
   ```
4. Configure your environment variables for both the client and server (see the Environment Variables section below).
5. Run database migrations and seed the database with initial test data:
   ```bash
   cd ../server
   npx prisma migrate dev
   npx prisma db seed
   ```
6. Start the backend server:
   ```bash
   npm run dev
   ```
7. In a new terminal window, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
8. Open your browser and navigate to `http://localhost:3000`.

### Environment Variables

**server/.env**
- `PORT` - The port on which the backend Express server runs (e.g., `5000`)
- `DATABASE_URL` - The PostgreSQL connection string used by Prisma (e.g., `"postgresql://user:password@localhost:5432/dbname"`)
- `JWT_SECRET` - A secure random string used to sign and verify JSON Web Tokens for authentication (e.g., `"your_secure_random_string_here"`)

**client/.env.local**
- `NEXT_PUBLIC_API_URL` - The base URL where the frontend will make API requests to the backend (e.g., `http://localhost:5000/api`)

### Database Setup
This project requires a PostgreSQL database. The database schema is managed via Prisma and is located at `server/prisma/schema.prisma`. 

To initialize your local database, run `npx prisma migrate dev` from within the `server/` directory. This command will create the necessary tables in your database.

After migrating, you must populate the database with required roles and test accounts by running `npx prisma db seed`. The seed script automatically provisions the following test accounts:
- **Admin Account**: `admin@example.com` / `Admin123!`
- **User Account**: `user@example.com` / `User123!`

The seed script also creates an initial project and tasks so that you can evaluate the platform immediately upon login.

### API Endpoints

| Method | Path | Auth Required | Role Required | Description |
|---|---|---|---|---|
| **POST** | `/api/auth/register` | No | - | Register a new user |
| **POST** | `/api/auth/login` | No | - | Authenticate user and return JWT |
| **GET** | `/api/projects/admin/all` | Yes | ADMIN | Fetch all projects system-wide |
| **POST** | `/api/projects` | Yes | - | Create a new project |
| **GET** | `/api/projects` | Yes | - | Get all projects owned by the authenticated user |
| **GET** | `/api/projects/:id` | Yes | - | Get details of a specific project |
| **PUT** | `/api/projects/:id` | Yes | - | Update a specific project |
| **DELETE** | `/api/projects/:id` | Yes | - | Delete a specific project |
| **GET** | `/api/tasks/admin/all` | Yes | ADMIN | Fetch all tasks system-wide |
| **POST** | `/api/tasks` | Yes | - | Create a new task within a project |
| **GET** | `/api/tasks` | Yes | - | Get tasks (Supports `?projectId=`, `?search=`, and `?status=` filters) |
| **GET** | `/api/tasks/:id` | Yes | - | Get details of a specific task |
| **PUT** | `/api/tasks/:id` | Yes | - | Update a specific task |
| **DELETE** | `/api/tasks/:id` | Yes | - | Delete a specific task |

### Folder Structure

```text
├── client
│   ├── src
│   │   ├── app
│   │   │   ├── dashboard
│   │   │   │   ├── projects
│   │   │   │   │   └── [id]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── register
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context
│   │   │   ├── AuthContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── lib
│   │   │   ├── api.ts
│   │   │   └── errorHandler.ts
│   │   └── types
│   │       └── index.ts
│   └── package.json
└── server
    ├── prisma
    │   └── schema.prisma
    ├── src
    │   ├── constants
    │   │   └── roles.ts
    │   ├── controllers
    │   │   ├── auth.controller.ts
    │   │   ├── project.controller.ts
    │   │   └── task.controller.ts
    │   ├── middlewares
    │   │   └── auth.middleware.ts
    │   ├── prisma
    │   │   ├── seed.ts
    │   │   └── verify.ts
    │   ├── routes
    │   │   ├── auth.routes.ts
    │   │   ├── project.routes.ts
    │   │   └── task.routes.ts
    │   ├── services
    │   │   ├── auth.service.ts
    │   │   ├── project.service.ts
    │   │   └── task.service.ts
    │   ├── types
    │   │   └── express.d.ts
    │   ├── utils
    │   │   ├── AppError.ts
    │   │   ├── prisma.ts
    │   │   └── validators.ts
    │   ├── app.ts
    │   └── server.ts
    └── package.json
```

### How to Run the Project
To run the full stack locally, ensure your PostgreSQL database is running and the `.env` variables are configured. 
1. Start the backend server by running `npm run dev` in the `server/` directory (defaults to port `5000`).
2. Start the frontend application by running `npm run dev` in the `client/` directory.
3. Access the application by opening `http://localhost:3000` in your browser. 
4. You can log in using the seeded test accounts:
   - To experience the platform as an administrator, use `admin@example.com` (Password: `Admin123!`).
   - To test standard user restrictions and scoping, use `user@example.com` (Password: `User123!`).
