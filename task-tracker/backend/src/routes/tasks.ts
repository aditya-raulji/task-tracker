import express from 'express';
import { body } from 'express-validator';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(
    [
      body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
      body('description').optional().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters')
    ],
    createTask
  );

router.route('/:id')
  .patch(updateTask)
  .delete(deleteTask);

export default router;
