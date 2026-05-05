import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get tasks (dashboard view)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('projectId', 'name')
        .sort({ dueDate: 1 });
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email')
        .populate('projectId', 'name')
        .sort({ dueDate: 1 });
    }
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks by project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
export const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (req.user.role !== 'admin' && !project.members.some(m => m.equals(req.user._id))) {
      res.status(403);
      throw new Error('Not authorized to access tasks for this project');
    }

    const tasks = await Task.find({ projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate, assignedTo, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const task = new Task({
      title,
      description,
      status: status || 'todo',
      dueDate,
      assignedTo,
      projectId,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    
    const populatedTask = await Task.findById(createdTask._id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check if user is admin or assigned to the task
    if (req.user.role !== 'admin' && (!task.assignedTo || !task.assignedTo.equals(req.user._id))) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task.status = status;
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};
