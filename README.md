# Decode Internship — Student Dashboard

A lightweight student dashboard to view, add, edit, and delete student records with basic analytics and charts.

Live demo: https://decode-internship.vercel.app/

## Table of Contents

- Features
- Demo
- Tech Stack
- Project Structure
- API (endpoints & examples)
- Installation (local)
- Running the app
- Database Setup
- Development notes
- Deployment
- Contributing
- License
- Contact

## Features

- List, add, update, and delete student records
- Dashboard stats: total students, average CGPA, top performers
- Visualizations: CGPA distribution and department pie chart
- Search and filter by department
- **MongoDB-backed backend (production-ready)**

## Demo

- Live app: https://decode-internship.vercel.app/

## Tech Stack

- Frontend: Vanilla HTML, CSS, JavaScript, Chart.js
- Backend: Node.js + Express
- Database: **MongoDB with Mongoose ODM**
- Data Validation: Schema-level constraints
- Environment Management: dotenv

## Project Structure

- Backend:
  - `backend/server-mongodb.js` — MongoDB-based server (recommended)
  - `backend/server.js` — Legacy JSON-based server
  - `backend/models/Student.js` — Mongoose schema
  - `backend/package.json`
  - `backend/.env.example` — Environment template
- Frontend:
  - `frontend/index.html`
  - `frontend/css/style.css`
  - `frontend/js/script.js`

## API

The backend exposes a small REST API (runs by default on port 5000).

Base URL (local): `http://localhost:5000`

Endpoints:

- GET `/students` — Returns JSON array of all students.

- POST `/students` — Create a new student. Body (JSON): `{ "name": "Name", "department": "Dept", "cgpa": 8.5 }` — Returns the created student (status 201).

- PUT `/students/:id` — Update student fields by `id`.

- DELETE `/students/:id` — Delete student by `id`.

## Installation (Local)

Prerequisites: Node.js 18+ and npm

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure MongoDB

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB URI:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/decode-internship?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Don't have MongoDB?** Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 3. Start Backend Server

```bash
# Using MongoDB (recommended)
npm start

# Or for development with auto-reload
npm run dev

# Or use legacy JSON-based server
npm run start-json
```

Server listens on `http://localhost:5000`

### 4. Serve Frontend

- Option A — open `frontend/index.html` directly in your browser.
- Option B — serve with a simple static server from project root:

```bash
npx serve frontend
# or
python -m http.server 8000 --directory frontend
```

## Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user with credentials
4. Whitelist your IP address
5. Get your connection string
6. Add it to `.env` as `MONGODB_URI`

### Local MongoDB (Optional)

If you prefer local development:
```bash
# Install MongoDB Community Server
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/decode-internship
```

## Development notes

- **Switching backends**: Edit `frontend/js/script.js` to change `API_BASE` or the server script in `package.json`
- **Schema validation**: Check `backend/models/Student.js` for constraints (CGPA 0-10, valid departments)
- **Default departments**: CSE, ME, ECE, AI, EEE, Civil (easily extensible)
- **Rollback to JSON**: Run `npm run start-json` to use the legacy JSON file storage

### Data Migration (JSON → MongoDB)

Already have data in `students.json`? Migrate it:

```bash
cd backend
node
```

```javascript
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./models/Student");

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  const data = JSON.parse(fs.readFileSync("students.json", "utf8"));
  await Student.insertMany(data);
  console.log("✅ Migration complete");
  process.exit(0);
}

migrate().catch(console.error);
```

## Deployment

### Frontend
- Static site hosting (Vercel, Netlify). Your site is already deployed: https://decode-internship.vercel.app/

### Backend
- **Important**: Use MongoDB (not `students.json`) for production
- Deployment options:
  - [Render](https://render.com) (free tier available)
  - [Railway](https://railway.app)
  - [Heroku](https://www.heroku.com)
  - [AWS Lambda](https://aws.amazon.com/lambda)
  - [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

### Environment Variables for Deployment
Set these in your deployment platform:
- `MONGODB_URI` — Your MongoDB Atlas connection string
- `PORT` — Optional (defaults to 5000)
- `NODE_ENV` — Set to `production`

## Testing & Troubleshooting

**If fetch requests fail in the browser:**
- Confirm backend is running and reachable at the configured base URL
- Check browser console for CORS or network errors
- Verify MongoDB URI in `.env` is correct

**MongoDB Connection Issues:**
- Check if IP is whitelisted in MongoDB Atlas
- Verify database user credentials
- Test connection string with MongoDB Compass

**To reset data:**
- For MongoDB: Delete documents via MongoDB Compass or shell
- For JSON: Edit or replace `backend/students.json`

## Version History

- **v2.0** (Current) — MongoDB-based with Mongoose schema validation
- **v1.0** — JSON file-based storage (legacy, still available with `npm run start-json`)

## Contributing

- Fork the repository, create a branch, and submit a PR with a clear summary.

## License

- MIT License

## Contact

- Questions or requests: open a GitHub issue or add contact info in the repo.

---

**Questions about MongoDB migration?** See [MONGODB_MIGRATION.md](./MONGODB_MIGRATION.md) for detailed setup guide.
