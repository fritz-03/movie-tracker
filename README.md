# Movie Tracker

A Next.js web application for tracking your personal movie collection with AWS cloud integration.

## Features

- User authentication (signup/login)
- Personal movie collection management
- **AWS RDS MySQL database** with Prisma ORM
- Responsive design with Tailwind CSS
- Cloud-based data storage

## Cloud Services Used

- **AWS RDS MySQL**: Managed relational database for persistent data storage
- **AWS EC2**: Elastic Compute Cloud for hosting the web application
- **AWS Cloud Infrastructure**: Scalable and reliable hosting

## Getting Started

### Prerequisites: Install Node.js (Fedora/RHEL)

If you don't have Node.js installed, run these commands:

```bash
sudo dnf remove nodejs -y

curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

sudo dnf install -y nodejs

node -v
npm -v
```

### 1. Install dependencies:
```bash
npm install
```

### 2. Set up AWS RDS MySQL:
Follow the detailed steps in [RDS_INTEGRATION_STEPS.md](./RDS_INTEGRATION_STEPS.md)

Quick summary:
- Create RDS MySQL instance on AWS
- Configure security group (allow port 3306)
- Get RDS endpoint

### 3. Configure environment:
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://admin:YOUR_PASSWORD@your-rds-endpoint.amazonaws.com:3306/movietracker"
```

### 4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev --name init_mysql
```

### 5. Run the development server:
```bash
npm run dev
```

### 6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 16
- **Database**: AWS RDS MySQL with Prisma ORM
- **Cloud Platform**: Amazon Web Services (AWS)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Database Schema

- **Users**: id, name, email, password, createdAt
- **Movies**: id, title, genre, watchDate, rating, notes, imageUrl, userId, createdAt

## Documentation

### 🎯 Start Here
- **[Complete Setup Summary](./COMPLETE_SETUP_SUMMARY.md)** - Full project overview, architecture, and checklist

### Database Setup (RDS MySQL)
- [Detailed RDS Integration Steps](./RDS_INTEGRATION_STEPS.md) - Complete walkthrough
- [RDS Quick Checklist](./RDS_QUICK_CHECKLIST.md) - Fast reference guide

### Deployment (EC2)
- [EC2 Deployment Guide](./EC2_DEPLOYMENT_GUIDE.md) - Full deployment walkthrough
- [EC2 Quick Checklist](./EC2_QUICK_CHECKLIST.md) - Fast deployment reference

### Presentation
- [Demo Video Guide](./DEMO_VIDEO_GUIDE.md) - How to record your final presentation

## Project Structure

```
movie-tracker/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard page
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   └── movies/       # Movie management pages
│   ├── components/       # React components
│   └── lib/              # Utilities (Prisma client)
├── prisma/
│   └── schema.prisma     # Database schema
└── .env                  # Environment variables (create this)
```

## Troubleshooting

**Can't connect to RDS?**
- Check security group allows port 3306
- Verify RDS endpoint and credentials
- Ensure RDS is publicly accessible

**Migration errors?**
- Ensure database exists: `CREATE DATABASE movietracker;`
- Check DATABASE_URL format
- Run `npx prisma migrate reset` to reset

**Need help?** See [RDS_INTEGRATION_STEPS.md](./RDS_INTEGRATION_STEPS.md) troubleshooting section.
