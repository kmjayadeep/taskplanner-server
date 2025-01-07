const express = require("express");
const app = express();

app.use(express.json());

let tasks = [];

app.get("/", (req, res) => res.send("Task Planner V1.0.0"));

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title, dueDate } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = { id: tasks.length, title, completed: false, dueDate };
    tasks.push(newTask);
    console.log(tasks)
    res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter((task) => task.id !== parseInt(id));
    res.status(204).send();
})


module.exports = app;
