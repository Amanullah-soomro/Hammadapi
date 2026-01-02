const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ===========================
// Neon Database Connection
// ===========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_JdyGgIfZQ43h@ep-autumn-boat-ah776cy3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

// ===========================
// EMPLOYEES API
// ===========================

// ➕ Add Employee
app.post('/api/employees', async (req, res) => {
  const { name, job, department } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO employees (name, job, department)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, job, department]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding employee:", error.message);
    res.status(500).json({ message: "Failed to add employee" });
  }
});

// 📥 Get All Employees
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, job, department FROM employees ORDER BY id ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// ===========================
// DEPARTMENTS API (Optional)
// ===========================

// ➕ Add Department
app.post('/api/departments', async (req, res) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO departments (name)
       VALUES ($1)
       RETURNING *`,
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding department:", error.message);
    res.status(500).json({ message: "Failed to add department" });
  }
});

// 📥 Get All Departments
app.get('/api/departments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name FROM departments ORDER BY id ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

// ===========================
// Test API
// ===========================
app.get('/', (req, res) => {
  res.send("Hammad API is Running Live!");
});

// ===========================
// Start Server
// ===========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
