const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Neon Database Connection
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_JdyGgIfZQ43h@ep-autumn-boat-ah776cy3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});

/*
===========================
 EMPLOYEES API
===========================
*/

// ➕ Add Employee
app.post('/api/employees', async (req, res) => {
  const { name, job, department_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO employees (name, job, department_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, job, department_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📥 Get Employees (with Department Name)
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, e.name, e.job, d.name AS department
       FROM employees e
       LEFT JOIN departments d
       ON e.department_id = d.id`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/*
===========================
 DEPARTMENTS API
===========================
*/

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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📥 Get Departments
app.get('/api/departments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM departments ORDER BY id ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Test API
app.get('/', (req, res) => {
  res.send("Hammad API is Running Live!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
