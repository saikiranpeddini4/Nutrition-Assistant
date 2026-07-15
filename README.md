# Nutri-Assist — MERN Stack Nutrition Assistant

A full-stack app (MongoDB, Express, React, Node.js) where users sign up, submit their
age/height/weight, and get a personalized diet suggestion (calories, BMI, macros, walking
target). Admins get a panel to view and delete every user's saved suggestions.

## Features

- JWT-based signup / login
- Personalized diet plan generator (BMI-based rule engine — see `backend/routes/diet.js`)
- "My Diet Plan" page — view and delete your own saved plans
- Admin Panel — view & delete any user's suggestion (admin flag set via `ADMIN_EMAILS` in `.env`)
- Responsive React front end styled to match the provided reference screenshots

## Project structure

```
nutri-assist/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Suggestion.js
│   ├── routes/auth.js
│   ├── routes/diet.js
│   ├── routes/admin.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js
    │   ├── components/Navbar.js
    │   ├── components/Footer.js
    │   ├── pages/Signup.js
    │   ├── pages/Login.js
    │   ├── pages/Home.js
    │   ├── pages/NewPlan.js
    │   ├── pages/MyDietPlan.js
    │   ├── pages/AdminPanel.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or an Atlas connection string)

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nutri-assist
JWT_SECRET=replace_this_with_a_long_random_secret
ADMIN_EMAILS=admin@nutriassist.com
```

`ADMIN_EMAILS` is a comma-separated list — any account that signs up with one of these emails
is automatically flagged as admin (`isAdmin: true`) and gets access to `/admin`.

Start the API:

```bash
npm run dev      # with nodemon, auto-restarts
# or
npm start
```

The API runs on `http://localhost:5000` by default. Health check: `GET /`.

## 2. Frontend setup

```bash
cd frontend
npm install
```

Optionally create `frontend/.env` to point at a non-default API URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React dev server:

```bash
npm start
```

Runs on `http://localhost:3000` and talks to the backend via the axios instance in
`src/api/axios.js`.

## 3. Using the app

1. Go to `http://localhost:3000/signup` and create an account.
   - To get an admin account, sign up with an email listed in `ADMIN_EMAILS`.
2. Log in — you land on the Home page.
3. Click **Get Diet Plan** (or **New Plan** in the nav) → fill in age, height, weight →
   **Get Diet Suggestions**.
4. View saved plans (with BMI, calories, macros, and a text suggestion) under **My Diet Plan**,
   and delete any of your own entries with the trash icon.
5. If logged in as an admin, an **Admin Panel** link appears in the nav — it lists every user's
   submissions with a **Delete** button.

## API reference

| Method | Route                        | Auth       | Description                          |
|--------|------------------------------|------------|---------------------------------------|
| POST   | `/api/auth/signup`           | Public     | Register a new user                   |
| POST   | `/api/auth/login`            | Public     | Log in, returns JWT                   |
| POST   | `/api/diet/suggest`          | User       | Submit age/height/weight, get a plan  |
| GET    | `/api/diet/my`               | User       | List the current user's saved plans   |
| DELETE | `/api/diet/:id`              | User       | Delete one of your own plans          |
| GET    | `/api/admin/suggestions`     | Admin      | List every user's saved plans         |
| DELETE | `/api/admin/suggestions/:id` | Admin      | Delete any user's plan                |

All authenticated routes expect `Authorization: Bearer <token>`.

## Notes / next steps

- The diet logic in `backend/routes/diet.js` is a transparent, rule-based estimate (Mifflin-St
  Jeor-style calorie baseline adjusted by BMI category) — swap in a more sophisticated model or
  call an external nutrition API if you want more nuance.
- Passwords are hashed with bcrypt; never commit a real `.env` file.
- For production, set a strong `JWT_SECRET`, enable HTTPS, and restrict CORS to your deployed
  frontend origin instead of the open default.
