# Movie Tracker

A Next.js web application for tracking your personal movie collection.

## Features

- User authentication (signup/login)
- Personal movie collection management
- SQLite database with Prisma ORM
- Responsive design with Tailwind CSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 16
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Database Schema

- **Users**: id, name, email, password, createdAt
- **Movies**: id, title, genre, watchDate, rating, notes, imageUrl, userId, createdAt
