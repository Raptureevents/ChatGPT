import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { query } from './db.js';


    password TEXT,
    role TEXT DEFAULT 'user',
    department TEXT

    comments TEXT,
    reviewed BOOLEAN DEFAULT FALSE,
    approved BOOLEAN DEFAULT FALSE,
    done BOOLEAN DEFAULT FALSE,
  await query(`CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  const rows = await query('SELECT id, password, role FROM users WHERE username=$1', [username]);
    res.json({ userId: user.id, role: user.role });
    await query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashed, 'user']);
  const { assigneeId } = req.query;
  const tasks = await query('SELECT * FROM tasks WHERE assignee_id=$1', [assigneeId]);

  const { userId, description, assigneeId, comments } = req.body;
  await query('INSERT INTO tasks (user_id, description, assignee_id, comments) VALUES ($1, $2, $3, $4)', [userId, description, assigneeId, comments]);
  await query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [assigneeId, 'New task assigned']);
  broadcast({ type: 'notifications' });
  const { description, assigneeId, comments, reviewed, approved, done } = req.body;
  await query('UPDATE tasks SET description=$1, assignee_id=$2, comments=$3, reviewed=$4, approved=$5, done=$6 WHERE id=$7', [description, assigneeId, comments, reviewed, approved, done, req.params.id]);
  await query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [assigneeId, 'Task updated']);
  broadcast({ type: 'notifications' });

app.get('/api/notifications', async (req, res) => {
  const { userId } = req.query;
  const rows = await query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY id DESC', [userId]);
  res.json(rows);
});

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

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write('\n');
  clients.push(res);
  req.on('close', () => {
    const idx = clients.indexOf(res);
    if (idx !== -1) clients.splice(idx, 1);
  });
});

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

  broadcast({ type: 'tasks' });
  res.status(201).end();
});

app.put('/api/tasks/:id', async (req, res) => {
  const { description, assigneeId, done } = req.body;
  await query('UPDATE tasks SET description=$1, assignee_id=$2, done=$3 WHERE id=$4', [description, assigneeId, done, req.params.id]);
  broadcast({ type: 'tasks' });
  res.end();
});

app.delete('/api/tasks/:id', async (req, res) => {
  await query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
  broadcast({ type: 'tasks' });
  res.end();
});


app.get('/api/projects', async (req, res) => {
  const { userId } = req.query;
  const rows = await query('SELECT * FROM projects WHERE user_id=$1', [userId]);
  res.json(rows);
});

app.post('/api/projects', async (req, res) => {
  const { userId, name } = req.body;
  await query('INSERT INTO projects (user_id, name) VALUES ($1, $2)', [userId, name]);
  broadcast({ type: 'projects' });
  res.status(201).end();
});

app.put('/api/projects/:id', async (req, res) => {
  const { name } = req.body;
  await query('UPDATE projects SET name=$1 WHERE id=$2', [name, req.params.id]);
  broadcast({ type: 'projects' });
  res.end();
});

app.delete('/api/projects/:id', async (req, res) => {
  await query('DELETE FROM projects WHERE id=$1', [req.params.id]);
  broadcast({ type: 'projects' });
  res.end();
});


app.get('/api/events', async (req, res) => {
  const { userId } = req.query;
  const rows = await query('SELECT * FROM events WHERE user_id=$1', [userId]);
  res.json(rows);
});

app.post('/api/events', async (req, res) => {
  const { userId, name } = req.body;
  await query('INSERT INTO events (user_id, name) VALUES ($1, $2)', [userId, name]);

  broadcast({ type: 'events' });
  res.status(201).end();
});

app.put('/api/events/:id', async (req, res) => {
  const { name } = req.body;
  await query('UPDATE events SET name=$1 WHERE id=$2', [name, req.params.id]);
  broadcast({ type: 'events' });
  res.end();
});

app.delete('/api/events/:id', async (req, res) => {
  await query('DELETE FROM events WHERE id=$1', [req.params.id]);
  broadcast({ type: 'events' });
  res.end();
});


app.get('/api/expenses', async (req, res) => {
  const { userId } = req.query;
  const rows = await query('SELECT * FROM expenses WHERE user_id=$1', [userId]);
  res.json(rows);
});

app.post('/api/expenses', async (req, res) => {
  const { userId, name } = req.body;
  await query('INSERT INTO expenses (user_id, name) VALUES ($1, $2)', [userId, name]);

  broadcast({ type: 'expenses' });
  res.status(201).end();
});

app.put('/api/expenses/:id', async (req, res) => {
  const { name } = req.body;
  await query('UPDATE expenses SET name=$1 WHERE id=$2', [name, req.params.id]);
  broadcast({ type: 'expenses' });
  res.end();
});

app.delete('/api/expenses/:id', async (req, res) => {
  await query('DELETE FROM expenses WHERE id=$1', [req.params.id]);
  broadcast({ type: 'expenses' });
  res.end();
});


app.listen(3001, () => console.log('Server running on port 3001'));
