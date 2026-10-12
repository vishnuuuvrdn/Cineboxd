# Cineboxd

A full-stack movie tracking web application inspired by Letterboxd, built with React and Node.js. Browse popular movies, search for any title, manage your watchlist and favorites, log what you've watched, and more — all backed by the TMDB API.

**Live Demo →** [cineboxd.vishnuuuvrdn.me](https://cineboxd.vishnuuuvrdn.me)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## Features

### For All Visitors
- Browse popular movies powered by the TMDB API
- Real-time movie search
- View detailed movie pages (overview, rating, release date, runtime, genres)
- See similar / recommended films on each movie's detail page

### For Registered Users
- **Favorites** — Add/remove movies from your personal favorites list
- **Watchlist** — Queue up movies you plan to watch
- **Watched** — Log movies you've already seen (with timestamp)
- **Profile** — Update your display name
- All user lists are persisted in MongoDB and accessible across sessions

### For Admins
- Admin panel with platform-wide statistics (total users, favorites, watched, watchlist)
- delete any user account

### Auth & Security
- JWT-based authentication (7-day tokens)
- Passwords hashed with bcrypt (10 salt rounds)
- Password strength enforced at registration via `zxcvbn` (minimum score of 3/4)
- Email format validation with `validator`
- Protected routes on the frontend; `authMiddleware` + `adminMiddleware` on the backend

---

## Tech Stack

### Frontend (`/client`)

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| TanStack React Query v5 | Server state management & caching |
| Axios | HTTP client |
| Tailwind CSS v4 | Utility-first styling |
| React Icons | Icon library |
| Cloudflare Workers + Wrangler | Deployment (static SPA) |

### Backend (`/server`)

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | HTTP server & routing |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| zxcvbn | Password strength estimation |
| validator | Email format validation |
| dotenv | Environment variable management |
| nodemon | Dev auto-restart |
| TMDB API | Movie data source |

---

## Project Structure

```
Cineboxd/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                # Static assets (icons, images)
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx     # Route guard for admin-only pages
│   │   │   ├── AuthLayout.jsx     # Shared layout for login/register forms
│   │   │   ├── BackButton.jsx     # Reusable back navigation button
│   │   │   ├── MovieCard.jsx      # Movie poster card component
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   ├── PageState.jsx      # Loading / error / empty state handler
│   │   │   └── ProtectedRoute.jsx # Route guard for authenticated users
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state (token + user)
│   │   ├── hooks/
│   │   │   ├── useFetch.jsx       # Generic fetch hook
│   │   │   ├── useIsMobile.jsx    # Responsive breakpoint hook
│   │   │   ├── useLocalStorage.jsx # Persistent state via localStorage
│   │   │   └── useToast.jsx       # Toast notification hook
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx     # Admin dashboard (stats + user management)
│   │   │   ├── Favorites.jsx      # User's favorite movies
│   │   │   ├── Home.jsx           # Movie browser + search
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── MovieDetails.jsx   # Movie detail page + actions
│   │   │   ├── Profile.jsx        # Edit profile + logout
│   │   │   ├── Register.jsx       # Registration form
│   │   │   ├── SimilarMovies.jsx  # Similar films section (used in MovieDetails)
│   │   │   └── Watchlist.jsx      # User's watchlist
│   │   ├── services/
│   │   │   ├── api.jsx            # Axios instance with auth interceptors
│   │   │   ├── authService.jsx    # Login / register API calls
│   │   │   ├── movieService.jsx   # TMDB-proxied movie API calls
│   │   │   └── userService.jsx    # Favorites, watchlist, watched, profile
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx               # App entry point (providers setup)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── wrangler.toml              # Cloudflare Workers deploy config
│
└── server/                        # Express backend
    ├── controllers/
    │   ├── authController.js      # Register, login, updateProfile, deleteUser, getStats, getAllUsers
    │   └── movieController.js     # Favorites, watchlist, watched, TMDB proxy
    ├── middleware/
    │   ├── adminMiddleware.js     # Checks req.user.role === 'admin'
    │   ├── authMiddleware.js      # Verifies JWT and attaches req.user
    │   └── validatePassword.js   # zxcvbn score check (min 3)
    ├── models/
    │   ├── Favorite.js            # { userId, movieId, title, poster }
    │   ├── User.js                # { name, email, password, role }
    │   ├── Watched.js             # { userId, movieId, title, poster, watchedAt }
    │   └── Watchlist.js           # { userId, movieId, title, poster }
    ├── routes/
    │   ├── authRoutes.js          # /api/auth/*
    │   └── movieRoutes.js         # /api/movies/*
    ├── services/
    │   └── movieService.js        # TMDB API calls (popular, search, details, similar)
    └── server.js                  # Express app entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or Atlas)
- [TMDB API key](https://www.themoviedb.org/settings/api) (free account)

### 1. Clone the Repository

```bash
git clone https://github.com/vishnuuuvrdn/Cineboxd.git
cd Cineboxd
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#environment-variables)).

```bash
npm start       # starts with nodemon on port 5000
```

### 3. Set Up the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev     # starts Vite dev server (usually http://localhost:5173)
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `TMDB_API_KEY` | Your TMDB API key |
| `CLIENT_URL` | Frontend origin (e.g. `http://localhost:5173`) — used for CORS |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000`) |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user (password strength validated) |
| `POST` | `/login` | ❌ | Login and receive a JWT |
| `PUT` | `/profile` | ✅ User | Update display name |
| `GET` | `/users` | ✅ Admin | List all users |
| `DELETE` | `/users/:id` | ✅ Admin | Delete a user and all their data |
| `GET` | `/stats` | ✅ Admin | Platform-wide counts (users, favorites, watched, watchlist) |

### Movies — `/api/movies`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | Fetch popular movies (from TMDB) |
| `GET` | `/search?query=...` | ❌ | Search movies by title |
| `GET` | `/:id` | ❌ | Fetch movie details |
| `GET` | `/:id/similar` | ❌ | Fetch similar / recommended movies |
| `POST` | `/favorite` | ✅ User | Add a movie to favorites |
| `GET` | `/favorites` | ✅ User | Get all favorites |
| `DELETE` | `/favorite/:id` | ✅ User | Remove from favorites |
| `POST` | `/watchlist` | ✅ User | Add to watchlist |
| `GET` | `/watchlist` | ✅ User | Get watchlist |
| `DELETE` | `/watchlist/:id` | ✅ User | Remove from watchlist |
| `POST` | `/watched/:id` | ✅ User | Mark a movie as watched |
| `GET` | `/watched/:id` | ✅ User | Check if a movie has been watched |
| `DELETE` | `/watched/:id` | ✅ User | Remove from watched log |

---

## Deployment

### Frontend — Cloudflare Workers

The client is configured for deployment as a static SPA on Cloudflare Workers via `wrangler.toml`.

```bash
cd client
npm run deploy      # runs: vite build && wrangler deploy
```

### Backend

The Express server can be deployed to any Node.js hosting platform (Railway, Render, Fly.io, etc.). Make sure to set all required environment variables and allow the deployed frontend's origin in `CLIENT_URL`.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
