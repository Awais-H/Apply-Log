# Apply Log

A comprehensive job application tracking system that helps you manage your job search process. Track applications through different stages (Applied, Interview, Offer, Rejected) with an intuitive Kanban-style interface.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Application Tracking**: Create, edit, and delete job applications
- **Status Management**: Organize applications into four stages (Applied, Interview, Offer, Rejected)
- **Search Functionality**: Quickly find applications by company, position, or location
- **Detailed Information**: Track position, company, salary, location, employment type, and deadlines
- **Notes System**: Add rejection notes to learn from your job search experience
- **Responsive Design**: Modern, dark-themed UI built with React and Tailwind CSS

## 🛠️ Technologies

**Frontend:** React 18 with TypeScript, Vite, Tailwind CSS, Radix UI

**Backend:** Express.js, Express.js 5, Prisma ORM, PostgreSQL

**Authentication:** JWT tokens with bcryptjs password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher) or Docker
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Apply-Log
```

2. **Install dependencies**
```bash
cd back-end && npm install
cd ../front-end && npm install
```

3. **Set up environment variables**

Create `back-end/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/apply_log"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

Create `front-end/.env` (optional):
```env
VITE_API_BASE=http://localhost:5000
```

4. **Set up database**
```bash
cd back-end
npx prisma migrate dev
npx prisma generate
```

## ▶️ Running the Application

**Development Mode:**

Terminal 1 - Backend:
```bash
cd back-end
npm run dev
```

Terminal 2 - Frontend:
```bash
cd front-end
npm run dev
```

**With Docker:**
```bash
cd back-end
docker-compose up --build
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`

## 📖 Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Add Applications**: Click "Add Application" to track new job applications
3. **Track Status**: Move applications between columns (Applied → Interview → Offer/Rejected)
4. **Search**: Use the search bar to quickly find specific applications
5. **Edit/Delete**: Expand cards to edit details or delete applications
6. **Notes**: Add rejection notes to track feedback and areas for improvement

## 📡 API Endpoints

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

**Applications** (requires JWT token in Authorization header):
- `GET /applications` - Get all user's applications
- `POST /applications` - Create new application
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application

## 🗄️ Database Schema

**User:** id, username (unique), password, applications[]

**Application:** id, position, company, salary, location, status, date, userId

**Status Values:** `applied`, `interview`, `offer`, `rejected`

## 📄 License

MIT License - see LICENSE file for details.
