import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      user: req.user?.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, completed } = req.body;

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user?.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user?.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
