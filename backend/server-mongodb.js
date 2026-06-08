const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/decode-internship")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* =========================
   GET ALL STUDENTS
========================= */

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
});

/* =========================
   ADD STUDENT
========================= */

app.post("/students", async (req, res) => {
  try {
    const { name, department, cgpa } = req.body;

    const student = new Student({ name, department, cgpa });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: "Error creating student", error: error.message });
  }
});

/* =========================
   UPDATE STUDENT
========================= */

app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: "Error updating student", error: error.message });
  }
});

/* =========================
   DELETE STUDENT
========================= */

app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted", student });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
