# सर्व हितम सेवा गौशाला समिति — Full-Stack (Frontend + Backend)

## 📁 Project Structure

```text
gaushala-website/
├── frontend/                   # 🖥️ React + Vite + Tailwind CSS (Public Site + Admin CMS)
│   ├── src/
│   │   ├── admin/             # Admin Panels & Protected Routes
│   │   ├── components/        # UI & Layout Components
│   │   ├── context/           # React Contexts (Data, Reports, Admin Auth)
│   │   ├── pages/             # Home, About, GauMata, Gallery, Donation, etc.
│   │   └── services/          # Backend API Client (api.js)
│   ├── public/
│   ├── index.html
│   ├── vite.config.js         # API Proxy to http://localhost:5001
│   └── package.json
│
├── backend/                    # ⚙️ Node.js + Express + MongoDB REST API
│   ├── src/
│   │   ├── config/            # Database Connection (MongoDB)
│   │   ├── controllers/       # Auth, Cows, Reports, Gallery, SiteInfo
│   │   ├── middlewares/       # JWT Auth, Multer File Upload, Error Handler
│   │   ├── models/            # Mongoose Schemas
│   │   ├── routes/            # REST API Routes (/api/*)
│   │   ├── utils/             # Initial Data Seeding
│   │   └── server.js          # Express Server (Port 5001)
│   ├── uploads/               # Image uploads folder
│   ├── .env                   # Configuration & MongoDB URI
│   └── package.json
│
├── package.json               # Root monorepo orchestration
└── README.md
```

---

## 🚀 How to Run the Project

You can run the commands directly from the root folder:

### 1. Frontend
```bash
npm run dev
# OR: npm run dev:frontend
```
Frontend runs on `http://localhost:5173`.

### 2. Backend Server
```bash
npm run dev:backend
# OR: npm run start:backend
```
Backend runs on `http://localhost:5001`.

---

## 🔑 Admin Login Credentials
* **URL:** `http://localhost:5173/admin/login`
* **Email:** `admin@gaushala.local` (or `sarvahitamsevasamiti@gmail.com`)
* **Password:** `change-this-password`
