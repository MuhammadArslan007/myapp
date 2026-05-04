# DevOps Portfolio Platform - How to Run

## Project Structure
```
myapp/
├── backend/        FastAPI (Python)
├── frontend/       React + Vite
├── nginx/          Nginx config
└── docker-compose.yml
```

---

## Option 1: Run Locally (Without Docker)

### Step 1 — Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API will be live at: http://localhost:8000
Swagger docs at:     http://localhost:8000/docs

### Step 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be live at: http://localhost:3000

---

## Option 2: Run with Docker Compose

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Nginx: http://localhost:80

---

## API Endpoints

| Method | URL                  | Description              |
|--------|----------------------|--------------------------|
| POST   | /api/login           | Admin login (JWT)        |
| GET    | /api/me              | Get current user         |
| GET    | /api/profile         | Portfolio profile        |
| GET    | /api/certifications  | List certifications      |
| GET    | /api/services        | List services            |
| GET    | /api/blog            | Blog posts               |
| POST   | /api/contact         | Send contact message     |

---

## Admin Credentials

```
Username: arslan
Password: Arslan@123
```

---

## Deploy to Linux Server (Production)

```bash
# 1. Clone or upload your project
scp -r myapp/ user@your-server:/var/www/

# 2. Install dependencies on server
cd /var/www/myapp
docker-compose up -d --build

# 3. Copy nginx config
sudo cp nginx/myapp.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl reload nginx
```
