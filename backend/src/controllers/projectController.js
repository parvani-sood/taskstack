import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Get all projects (admin gets all, member gets assigned)
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('members', 'name email').populate('createdBy', 'name');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email').populate('createdBy', 'name');
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      members: members || [],
      createdBy: req.user._id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is admin or a member of the project
    if (req.user.role !== 'admin' && !project.members.some(m => m._id.equals(req.user._id))) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project members
// @route   PUT /api/projects/:id/members
// @access  Private/Admin
export const updateProjectMembers = async (req, res, next) => {
  try {
    const { members } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.members = members;
    const updatedProject = await project.save();
    
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};
