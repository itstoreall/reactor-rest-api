const ProjectModel = require('../model/projectModel');
const { HttpCode } = require('../helpers/constants');

// GET
const getAll = async (req, res, next) => {
  try {
    const projects = await ProjectModel.getAll(req.query);
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { projects } });
  } catch (error) {
    next(error);
  }
};

// GET Filtered
const getFiltered = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // const projects = await ProjectModel.getFiltered(userId);
    const { projects, total, limit, offset } = await ProjectModel.getFiltered(
      userId,
      req.query,
    );
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { total, limit, offset, projects },
    });
  } catch (err) {
    next(err);
  }
};

// GET by ID
const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const project = await ProjectModel.getById(userId, req.params.id);
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
  } catch (err) {
    next(err);
  }
};

// CREATE
const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const project = await ProjectModel.create({
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
    const project = await ProjectModel.remove(userId, req.params.id);

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
    const project = await ProjectModel.update(userId, req.params.id, req.body);

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

// IMAGES
const images = async (req, res, next) => {
  try {
    return res.json({});
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getFiltered, getById, create, remove, update, images };

/**
 * Controllers
 *
 * - req.query (for mongoose pagination)
 */
