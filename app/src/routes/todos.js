const express = require("express");
const router = express.Router();

let nextId = 1;
const todos = new Map();

// LIST
router.get("/todos", (_req, res) => {
  res.json(Array.from(todos.values()));
});

// CREATE
router.post("/todos", (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title must be a string" });
  }
  const todo = { id: nextId++, title, done: false, createdAt: new Date().toISOString() };
  todos.set(todo.id, todo);
  res.status(201).json(todo);
});

// UPDATE (toggle done eller title)
router.patch("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.get(id);
  if (!todo) return res.status(404).json({ error: "not found" });

  const { title, done } = req.body || {};
  if (title !== undefined) {
    if (typeof title !== "string") return res.status(400).json({ error: "title must be string" });
    todo.title = title;
  }
  if (done !== undefined) {
    if (typeof done !== "boolean") return res.status(400).json({ error: "done must be boolean" });
    todo.done = done;
  }
  todos.set(id, todo);
  res.json(todo);
});

// DELETE
router.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existed = todos.delete(id);
  if (!existed) return res.status(404).json({ error: "not found" });
  res.status(204).send();
});

module.exports = router;
