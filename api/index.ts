const express = require("express");
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())

const FILE_PATH = path.join('/tmp', 'todos.json');

const readTasks = () => {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeTasks = (todos) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
};

app.get("/", (req, res) => res.send("Task Planner V1.0.0"));

app.get('/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/tasks', (req, res) => {
  const { title, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  let tasks = readTasks()
  if (tasks.length > 100) {
    return res.status(500).json({ error: 'Task Overflow!' });
  }
  const newTask = { id: tasks.length, title, completed: false, dueDate };
  tasks.push(newTask);
  writeTasks(tasks)
  res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  let tasks = readTasks()
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  writeTasks(tasks)
  res.status(204).send();
})


module.exports = app;
