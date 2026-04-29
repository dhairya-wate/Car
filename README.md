# Motor. — Full-Stack Car Marketplace

A clean, black-and-white automotive marketplace built with React, Node.js/Express, and MySQL.

---

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React 18, React Router v6     |
| Backend  | Node.js, Express 4            |
| Database | MySQL 8                       |
| Auth     | JWT + bcryptjs                |
| HTTP     | Axios                         |

---

## Project Structure

```
carsite/
├── schema.sql               # MySQL schema + seed data
├── backend/
│   ├── server.js            # Express entry point
│   ├── db.js                # MySQL connection pool
│   ├── .env.example         # Environment variables template
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   └── routes/
│       ├── auth.js          # /api/auth/* (signup, login)
│       └── cars.js          # /api/cars/* (CRUD)
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css        # Global styles + CSS variables
        ├── api.js           # Axios instance
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js / .css
        │   ├── Footer.js / .css
        │   ├── CarCard.js / .css
        │   ├── CarModal.js / .css
        │   └── ProtectedRoute.js
        └── pages/
            ├── Home.js / .css
            ├── Cars.js / .css
            ├── CarDetail.js / .css
            ├── Login.js
            ├── Signup.js
            ├── Auth.css
            └── Dashboard.js / .css
```

---

## Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

---

## Setup Instructions

### 1. Clone / Download the project

```bash
cd carsite
```

### 2. Set up the Database

Open your MySQL client and run:

```bash
mysql -u root -p < schema.sql
```

Or paste the contents of `schema.sql` into MySQL Workbench / DBeaver.

This creates:
- `carsite` database
- `users` table
- `cars` table (with 3 sample cars)

### 3. Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=carsite
JWT_SECRET=change_this_to_a_long_random_string
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Backend runs on: http://localhost:5000

### 4. Configure the Frontend

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

> The `"proxy": "http://localhost:5000"` in frontend/package.json automatically forwards `/api` calls to the backend.

---

## API Endpoints

### Auth

| Method | Endpoint          | Body                        | Auth  | Response            |
|--------|-------------------|-----------------------------|-------|---------------------|
| POST   | /api/auth/signup  | `{name, email, password}`   | No    | `{token, user}`     |
| POST   | /api/auth/login   | `{email, password}`         | No    | `{token, user}`     |

### Cars

| Method | Endpoint        | Body                                      | Auth     |
|--------|-----------------|-------------------------------------------|----------|
| GET    | /api/cars       | —                                         | No       |
| GET    | /api/cars/:id   | —                                         | No       |
| POST   | /api/cars       | `{name, brand, price, image, description}`| Yes      |
| PUT    | /api/cars/:id   | `{name, brand, price, image, description}`| Yes (owner) |
| DELETE | /api/cars/:id   | —                                         | Yes (owner) |

---

## Features

- **Authentication** — JWT-based login/signup with bcrypt password hashing
- **Protected routes** — Dashboard only accessible when logged in
- **Car CRUD** — Add, edit, delete cars from your dashboard
- **Car listings** — Public inventory with search + brand filter
- **Car detail page** — Full view with owner controls
- **Responsive design** — Mobile-first, works on all screen sizes

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars
CREATE TABLE cars (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  brand       VARCHAR(100) NOT NULL,
  price       DECIMAL(12,2) NOT NULL,
  image       VARCHAR(500),
  description TEXT,
  user_id     INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Notes

- The sample data in `schema.sql` requires a user with `id=1` to exist. Create an account first via the UI, then re-run the car inserts if you want seed data.
- Images are stored as URLs. Use any publicly accessible image link (Unsplash works great).
- JWT tokens expire after 7 days.
