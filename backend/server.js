const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE = "students.json";

/* =========================
   FILE HELPERS
========================= */

function getStudents() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveStudents(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/* =========================
   GET ALL STUDENTS
========================= */

app.get("/students", (req, res) => {
  res.json(getStudents());
});

/* =========================
   ADD STUDENT
========================= */

app.post("/students", (req, res) => {
  const students = getStudents();
  const { name, department, cgpa } = req.body;

  if (!name || !department || cgpa === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (cgpa < 0 || cgpa > 10) {
    return res.status(400).json({ message: "CGPA must be between 0 and 10" });
  }

  const student = {
    id: Date.now(),
    name,
    department,
    cgpa: parseFloat(cgpa),
  };

  students.push(student);
  saveStudents(students);
  res.status(201).json(student);
});

/* =========================
   UPDATE STUDENT
========================= */

app.put("/students/:id", (req, res) => {
  const students = getStudents();
  const id = Number(req.params.id);
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { cgpa } = req.body;
  if (cgpa !== undefined && (cgpa < 0 || cgpa > 10)) {
    return res.status(400).json({ message: "CGPA must be between 0 and 10" });
  }

  students[index] = { ...students[index], ...req.body };
  saveStudents(students);
  res.json(students[index]);
});

/* =========================
   DELETE STUDENT
========================= */

app.delete("/students/:id", (req, res) => {
  const students = getStudents();
  const id = Number(req.params.id);
  const filtered = students.filter((student) => student.id !== id);

  if (filtered.length === students.length) {
    return res.status(404).json({ message: "Student not found" });
  }

  saveStudents(filtered);
  res.json({ message: "Student deleted" });
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
