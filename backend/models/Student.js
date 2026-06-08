const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    department: {
      type: String,
      required: [true, "Please provide a department"],
      trim: true,
      enum: {
        values: ["CSE", "ME", "ECE", "AI", "EEE", "Civil"],
        message: "Please provide a valid department",
      },
    },
    cgpa: {
      type: Number,
      required: [true, "Please provide CGPA"],
      min: [0, "CGPA cannot be less than 0"],
      max: [10, "CGPA cannot exceed 10"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
