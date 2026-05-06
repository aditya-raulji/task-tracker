import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

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
    return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
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

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid Task ID format' });
  }

  const updateFields: any = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (completed !== undefined) updateFields.completed = completed;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid Task ID format' });
  }

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
