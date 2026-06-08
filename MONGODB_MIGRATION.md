# MongoDB Migration Guide

## Overview
This project has been upgraded from **file-based JSON storage** to **MongoDB** for better scalability, data validation, and production readiness.

## What Changed

### Before (File-based)
- Data stored in `backend/students.json`
- Synchronous file I/O operations
- Limited validation
- Not suitable for concurrent requests

### After (MongoDB)
- Data stored in MongoDB Atlas cluster
- Asynchronous database operations
- Schema validation with Mongoose
- Better error handling
- Production-ready

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create MongoDB Atlas Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Create a database user with credentials
- Get connection string

### 3. Configure Environment
```bash
# Copy the example
cp .env.example .env

# Edit .env and add your MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/decode-internship?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 4. Start Server
```bash
# For MongoDB version (recommended)
npm start

# For development with auto-reload
npm run dev

# For original JSON version
npm run start-json
```

## Migration Data (Optional)

If you want to migrate existing data from `students.json` to MongoDB:

```javascript
// Run this script in Node REPL or create a migration file
const fs = require("fs");
const mongoose = require("mongoose");
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

## Key Improvements

✅ **Validation** - Schema-level constraints (CGPA 0-10, valid departments)  
✅ **Scalability** - Handle concurrent requests efficiently  
✅ **Production Ready** - Proper error handling and logging  
✅ **Timestamps** - Automatic `createdAt` and `updatedAt` fields  
✅ **Flexibility** - Easy to add new fields without code changes  

## API Compatibility

The API endpoints remain the same:
- `GET /students` - List all students
- `POST /students` - Create student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

**Note:** Student IDs are now MongoDB ObjectIds (24-char hex strings) instead of timestamps.

## Troubleshooting

### Connection refused
- Check MongoDB URI in `.env`
- Verify IP whitelist in MongoDB Atlas

### Validation errors
- Check CGPA is between 0-10
- Ensure department is valid: CSE, ME, ECE, AI, EEE, Civil

### PORT already in use
- Change PORT in `.env` or kill existing process
