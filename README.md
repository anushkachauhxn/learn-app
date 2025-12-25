# 📖 Learn App

## Tech Stack

- Next.js
- Nest.js
- Prisma (Postgres db)

## Architecture

```
├── apps
│   ├── api (backend)
│   └── web (frontend)
├── packages
│   └──database (postgres db)
└── turbo.json
```

## Database Schema

<img width="839" height="790" alt="Screenshot 2025-12-25 at 10 04 50 AM" src="https://github.com/user-attachments/assets/c560f3fb-fb5f-4256-8183-f31257826135" />

## API Specification

These are the API endpoints:

#### Courses

- GET `/api/courses` - Get all courses
- GET `/api/courses/:id?userId=:userId` - Get course details by id for a specific user
- GET `/api/courses/similar/:id` - Get similar courses to a course
- POST `/api/courses/:id/enroll` - Enroll a user in a course
- POST `/api/courses/:id/unenroll` - Unenroll a user from a course
- POST `/api/courses/create` - Create a new course
- POST `/api/courses/update/:id` - Update a course
- POST `/api/courses/delete/:id` - Delete a course

#### Lessons

- GET `/api/lessons/all/:courseId` - Get all lessons for a course
- GET `/api/lessons/:id?userId=:userId` - Get lesson details by id for a specific user
- POST `/api/lessons/complete/:id?userId=:userId` - Mark a lesson as completed by a user
- POST `/api/lessons/create` - Create a new lesson
- POST `/api/lessons/update/:id` - Update a lesson
- POST `/api/lessons/delete/:id` - Delete a lesson


#### Users

- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user details by id
- GET `/api/users/stats/:id` - Get user stats by id


## How to setup and run in dev?

Setup the codebase by cloning the repo:

```bash
git clone https://github.com/anushkachauhxn/learn-app.git
npm install
```

Setup your prisma console and add the DATABASE_URL in `packages/database/.env`. Then run the following commands:

```bash
cd packages/database
npm install
npx turbo db:generate
npx turbo db:migrate
npx turbo db:seed
```

To run all three services in your local machine, run the following command:

```bash
npx turbo run dev
```

You can now start developing!

## How to run in production?

You can run the entire app in production using Docker Compose.

```bash
docker compose up --build
```

See the [Docker Setup](https://github.com/anushkachauhxn/learn-app/blob/main/DOCKER_SETUP.md) for instructions on how to run in production.

## Future Features

- User authentication and authorization
- Adding categories and difficulty level to courses
- Filtering courses by categories, tags and difficulty level
- Better process to track lesson completion - by time, by date, etc.
- Better method for course completion stats - all lessons should not hold same weightage
- For authors, allow them to create and manage their own courses
