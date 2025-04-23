const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  next();
};

// Create a Task
router.post('/', isAuthenticated, async (req, res) => {
  const { task } = req.body;
  const userId = req.session.userId;

  try {
    const newTask = await Task.create({ task, userId });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: 'Error creating task' });
  }
});

// Get all Tasks for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching tasks' });
  }
});

// Update Task (Complete/Incomplete)
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Error updating task' });
  }
});

// Delete Task
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
