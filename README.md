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
- Simple JSON-backed backend (file persistence)

## Demo

- Live app: https://decode-internship.vercel.app/

## Tech Stack

- Frontend: Vanilla HTML, CSS, JavaScript, Chart.js
- Backend: Node.js + Express
- Data store: local JSON file (`backend/students.json`)

## Project Structure

- Backend:
  - `backend/server.js`
  - `backend/package.json`
  - `backend/students.json`
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

Prerequisites: Node.js 18+ and npm, or a static file server for frontend.

1. Install backend dependencies and start server:

```bash
cd backend
npm install
npm start
# Server listens on http://localhost:5000
```

2. Serve frontend:

- Option A — open `frontend/index.html` directly in your browser.
- Option B — serve with a simple static server from project root:

```bash
npx serve frontend
# or
python -m http.server 8000 --directory frontend
```

## Development notes

- The frontend currently defaults to the deployed API; to use the local backend change the API base (or set `API_BASE`) in `frontend/js/script.js`.
- The backend persistently stores data in `backend/students.json`. Keep backups if needed.

## Deployment

- Frontend: static site hosting (Vercel, Netlify). Your site is already deployed: https://decode-internship.vercel.app/
- Backend: Node/Express host (Render, Heroku, Railway, AWS, etc.). Ensure `students.json` file permissions allow writes, or replace file-based storage with a small database for production.

## Testing & Troubleshooting

- If fetch requests fail in the browser:
  - Confirm backend is running and reachable at the configured base URL.
  - Check browser console for CORS or network errors.
- To reset data: edit or replace `backend/students.json`.

## Contributing

- Fork the repository, create a branch, and submit a PR with a clear summary.

## License

- MIT License — include `LICENSE` file if you want to publish under MIT.

## Contact

- Questions or requests: open a GitHub issue or add contact info in the repo.

---

If you want, I can open a PR with these changes, or update `frontend/js/script.js` further to make the API base configurable via an `ENV` or UI toggle.
