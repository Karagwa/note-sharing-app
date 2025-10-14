# NoteShare

A  full-stack note-sharing application built with FastAPI backend and React frontend. Create, manage, and share your notes with unique shareable links.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)

##  Features

###  Authentication & Security
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected API routes
- Password reset functionality
- Session management

###  Note Management
- **Create** notes with rich text content
- **Read** and view all your notes
- **Update** existing notes
- **Delete** unwanted notes
- Real-time note editing
- Automatic timestamps (created & updated)

###  Note Sharing
- Generate unique shareable links
- Public note viewing without authentication
- Token-based access control
- Share notes with anyone via URL
- Revoke share access anytime

##  Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL databases with Python type hints
- **SQLite** - Lightweight database
- **Alembic** - Database migrations
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **TanStack Query** - Data fetching & caching
- **Context API** - State management
- **Lucide React** - Beautiful icons
- **CSS3** - Custom styling with gradients

##  Prerequisites

- **Python** 3.10 not 3.13 due to incompatibility with auth dependencies like bcrypt
- **Node.js** 16 or higher
- **npm** or **yarn**
- **Git**

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Karagwa/note-sharing-app.git
cd note-sharing-app
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install r
```

#### Run Database Migrations

```bash
# Apply migrations to create database tables
alembic upgrade head
```

#### Start Backend Server

```bash
uvicorn backend.main:app --reload
```

Backend will run on: **http://127.0.0.1:8000**

### 3. Frontend Setup

#### Navigate to Frontend Directory

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Start Development Server

```bash
npm start
```

Frontend will run on: **http://localhost:3000**

##  API Documentation

Once the backend is running, you can access interactive API documentation:

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

#### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `GET /api/notes/{id}` - Get specific note
- `PATCH /api/notes/{id}` - Partially update note
- `PUT /api/notes/{id}` - Fully update note
- `DELETE /api/notes/{id}` - Delete note

#### Sharing
- `POST /api/notes/{id}/share` - Generate share link
- `GET /api/shared/{token}` - View shared note (public)
- `DELETE /api/notes/{id}/share` - Revoke share access
- `GET /api/notes/{id}/share` - Get share info

##  Project Structure

```
note-sharing-app/
├── backend/
│   ├── auth/
│   │   └── security.py          # JWT & password utilities
│   ├── routes/
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── notes.py             # Note CRUD endpoints
│   │   └── share.py             # Sharing endpoints
│   ├── database.py              # Database configuration
│   ├── main.py                  # FastAPI app & CORS setup
│   ├── models.py                # SQLModel database models
│   └── schemas.py               # Pydantic schemas
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── ForgotPassword.jsx
│       │   │   └── Auth.css
│       │   ├── Layout/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Layout.jsx
│       │   │   └── Navbar.css
│       │   ├── Notes/
│       │   │   ├── NoteList.jsx
│       │   │   ├── NoteCard.jsx
│       │   │   ├── NoteEditor.jsx
│       │   │   ├── ShareNote.jsx
│       │   │   └── Notes.css
│       │   ├── Shared/
│       │   │   └── SharedNote.jsx
│       │   ├── Home.jsx
│       │   └── Home.css
│       ├── context/
│       │   └── AuthContext.js   # Authentication state
│       ├── hooks/
│       │   └── useAuth.js       # Auth custom hook
│       ├── services/
│       │   └── api.js           # Axios API client
│       ├── App.js               # Main app component
│       ├── App.css
│       └── index.js
├── alembic/
│   ├── versions/                # Migration files
│   ├── env.py
│   └── script.py.mako
├── .gitignore
├── .gitattributes
├── alembic.ini
└── README.md
```

##  Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# JWT Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///./database.db

# CORS Origins (optional)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Generating a Secret Key

```python
# Python
import secrets
print(secrets.token_urlsafe(32))
```

Or use OpenSSL:

```bash
openssl rand -hex 32
```

##  Usage Guide

### 1. Register an Account
- Navigate to http://localhost:3000/register
- Fill in username, email, and password
- Click "Create Account"

### 2. Login
- Go to http://localhost:3000/login
- Enter your credentials
- You'll be redirected to your notes dashboard

### 3. Create a Note
- Click the "+ New Note" button
- Enter a title and content
- Click "Save Note"

### 4. Share a Note
- Click the share icon on any note
- Click "Generate Share Link"
- Copy the generated link
- Share it with anyone!

### 5. View Shared Notes
- Anyone with the share link can view the note
- No login required for viewing shared notes


##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

##  Known Issues

- None at the moment! 



## Support

If you have any questions or need help, please open an issue on GitHub.

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Amazing Python web framework
- [React](https://reactjs.org/) - The best UI library
- [SQLModel](https://sqlmodel.tiangolo.com/) - SQL databases made easy
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set
- Inspiration from Notion, Evernote, and Google Keep

## Star History

If you find this project useful, please consider giving it a star ⭐

---

**Made with ❤️ by [Karagwa](https://github.com/Karagwa)**

*Happy Note Taking! *
