const ProjectController = require('../model/projectModel');
const { HttpCode } = require('../helpers/constants');

// GET
const getAll = async (req, res, next) => {
  try {
    // console.log(`User ${req.user.name} is hashed`); // hashing user *
    const projects = await ProjectController.getAll();

    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { projects } });
  } catch (error) {
    next(error);
  }
};

// GET by ID
const getById = async (req, res, next) => {
  try {
    const project = await ProjectController.getById(req.params.id);

    // console.log('toObject()-->', project); // toObject() *

    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } }); // toJSON() *
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Project Not Found',
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const project = await ProjectController.create({
      ...req.body,
      owner: userId,
    });

    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { project } });
  } catch (e) {
    if (e.name === 'ValidationError') {
      e.status = HttpCode.BAD_REQUEST;
    }
    next(e);
  }
};

// DELETE
const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const project = await ProjectController.remove(userId, req.params.id);

    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Project Not Found',
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const project = await ProjectController.update(
      userId,
      req.params.id,
      req.body,
    );

    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Project Not Found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, remove, update };

/**
 * Controllers
 */
