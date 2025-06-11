import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { query } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

async function init() {
  await query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
  )`);

  await query(`CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    description TEXT,
    assignee_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await query(`CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT
  )`);

  await query(`CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT
  )`);

  await query(`CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT
  )`);
}

init();

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const rows = await query('SELECT id, password FROM users WHERE username=$1', [username]);
  const user = rows[0];
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ userId: user.id });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);
    res.status(201).end();
  } catch (err) {
    res.status(400).json({ error: 'User exists' });
  }
});

app.get('/api/tasks', async (req, res) => {
  const { userId } = req.query;
  const tasks = await query('SELECT * FROM tasks WHERE user_id=$1', [userId]);
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { userId, description, assigneeId } = req.body;
  await query('INSERT INTO tasks (user_id, description, assignee_id) VALUES ($1, $2, $3)', [userId, description, assigneeId]);
  res.status(201).end();
});

app.get('/api/projects', async (req, res) => {
  const { userId } = req.query;
  const rows = await query('SELECT * FROM projects WHERE user_id=$1', [userId]);
  res.json(rows);
});

app.post('/api/projects', async (req, res) => {
  const { userId, name } = req.body;
  await query('INSERT INTO projects (user_id, name) VALUES ($1, $2)', [userId, name]);
  res.status(201).end();
});

app.get('/api/events', async (req, res) => {
  const { userId } = req.query;
  const rows = await query('SELECT * FROM events WHERE user_id=$1', [userId]);
  res.json(rows);
});

app.post('/api/events', async (req, res) => {
  const { userId, name } = req.body;
  await query('INSERT INTO events (user_id, name) VALUES ($1, $2)', [userId, name]);
  res.status(201).end();
});

app.get('/api/expenses', async (req, res) => {
  const { userId } = req.query;
  const rows = await query('SELECT * FROM expenses WHERE user_id=$1', [userId]);
  res.json(rows);
});

app.post('/api/expenses', async (req, res) => {
  const { userId, name } = req.body;
  await query('INSERT INTO expenses (user_id, name) VALUES ($1, $2)', [userId, name]);
  res.status(201).end();
});

app.listen(3001, () => console.log('Server running on port 3001'));
