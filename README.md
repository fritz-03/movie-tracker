# Movie Tracker

A cloud-based web application for tracking your personal movie collection, built with Next.js and deployed on AWS.

## Features

- User authentication (signup/login)
- Personal movie collection management
- Add, edit, delete movies with ratings & notes
- AWS RDS MySQL database
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL (AWS RDS or local)
- **Cloud**: AWS EC2, AWS RDS

---

## Getting Started

### Option 1: Run Locally (Localhost)

#### Prerequisites
- Node.js 20+ installed
- SQLite (default) or MySQL database

#### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/movie-tracker.git
cd movie-tracker

# 2. Install dependencies
npm install

# 3. Set up the database (uses SQLite by default)
npx prisma generate
npx prisma migrate dev --name init

# 4. Start the development server
npm run dev
```

#### 5. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

### Option 2: Deploy on AWS EC2

#### Prerequisites
- AWS EC2 instance (Amazon Linux 2023)
- AWS RDS MySQL database
- Security groups configured (ports 22, 3000, 3306)

#### Steps

```bash
# 1. Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# 2. Install Git
sudo yum install git -y

# 3. Install Node.js and npm
sudo yum install npm -y

# 4. Install MySQL client (for database connection)
sudo dnf install mariadb105 -y

# 5. Clone the repository
git clone https://github.com/YOUR_USERNAME/movie-tracker.git
cd movie-tracker

# 6. Install dependencies
sudo dnf remove nodejs -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
node -v
npm -v

# 7. Configure the database connection
nano prisma/schema.prisma
```

#### 8. Update `prisma/schema.prisma`

Change the datasource to use MySQL and your RDS endpoint:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://admin:YOUR_PASSWORD@your-rds-endpoint.amazonaws.com:3306/moviedb"
}
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`)

```bash
# 9. Run database migrations
npx prisma migrate dev --name movierds

# 10. Start the application
npm run dev
```

#### 11. Access the application
Open your browser and navigate to:
```
http://your-ec2-public-ip:3000
```

---

## Project Structure

```
movie-tracker/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard page
│   │   ├── login/        # Login page
│   │   └── signup/       # Signup page
│   └── lib/
│       └── prisma.ts     # Database client
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

---

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  movies    Movie[]
}

model Movie {
  id        Int       @id @default(autoincrement())
  title     String
  genre     String?
  watchDate DateTime?
  rating    Int?
  notes     String?
  imageUrl  String?
  createdAt DateTime  @default(now())
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
}
```

---

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

---

## License

MIT License
