# New Hire Onboarding Web Application (Frontend)

## Overview
This is the frontend for the New Hire Onboarding Web Application, built with **Next.js** using page-based routing. The application allows new hires to enter their details, receive a passwordless magic login link, select an appropriate training path based on their role, and view a summary of their onboarding journey.

## Demo Video

Watch the full demo (5-minute walkthrough):  
[![Watch the video](https://img.youtube.com/vi/4bPM0FHBWzM/0.jpg)](https://youtu.be/4bPM0FHBWzM)


## Features
- **Company-branded UI** with responsive design
- **Form validation** for user input fields
- **Passwordless login** via email (magic link)
- **Dynamic training path selection** based on job role
- **User dashboard** with onboarding status
- **Admin dashboard** with CSV export, filters & search (optional)
- **JWT authentication** and role checking

## Tech Stack
- **Frontend Framework:** Next.js (Pages Router)
- **UI Styling:** Tailwind CSS + HeroUI
- **Database ORM:** Prisma (with SQLite)
- **Authentication:** JSON Web Tokens (JWT)
- **Email Service:** MailHog (for local testing)

---

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**

---

## Setup

### 1. Clone the repository
```sh
git clone git@github.com:mrnat7471/BP0278796-part-1-frontend.git
cd BP0278796-part-1-frontend
````

### 2. Install dependencies

```sh
npm install
```

or

```sh
yarn install
```

### 3. Environment variables

Create a `.env` file at the root with:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key"

EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
EMAIL_FROM="onboarding@starkindustries.com"

BASE_URL=http://localhost:3000
```

---

## Database Setup

### 4. Generate schema & migrate

```sh
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed initial data (optional)

Make sure `prisma/seed.ts` exists and run:

```sh
npx prisma db seed
```

---

## Email Testing (Magic Link Login)

### 6. Install MailHog (for local testing)

```sh
brew install mailhog
```

### 7. Start MailHog

```sh
mailhog
```

### 8. View Inbox

Visit: [http://localhost:8025](http://localhost:8025)

---

## Running the Application

### Development Mode

```sh
npm run dev
```

or

```sh
yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

### Production Mode

```sh
npm run build
npm start
```

or

```sh
yarn build
yarn start
```

---

## Admin Dashboard (Optional)

To enable admin features:

* Ensure the JWT user payload includes `role: "admin"`
* Or manually set it in your SQLite DB

Features:

* View all hires
* Filter by role
* Search by name/email
* Export results to CSV

---

## Folder Structure Highlights

```
/pages
  /api/verify         – Magic link login
  /api/profile        – Get/update profile
  /api/admin/users    – Admin list users
  /dashboard          – New hire dashboard
  /learning-paths     – Selection & detail view
  /admin/dashboard    – Admin CSV/search/export

/prisma
  schema.prisma       – Database models
  seed.ts             – Learning path/course data

/lib
  auth.ts             – JWT helper for API auth
```

---

## Notes

* This app uses SQLite via Prisma for simplicity and portability.
* For production, consider switching to PostgreSQL.
* Authentication is handled via JWT stored in `localStorage`.
