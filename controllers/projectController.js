const ProjectController = require('../model/projectModel');
const { HttpCode } = require('../helpers/constants');

// GET
const getAll = async (req, res, next) => {
  try {
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

    console.log('toObject()-->', project); // toObject() *

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

// POST
const create = async (req, res, next) => {
  try {
    const project = await ProjectController.create(req.body);

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
    const project = await ProjectController.remove(req.params.id);

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

// PUT
const update = async (req, res, next) => {
  try {
    const project = await ProjectController.update(req.params.id, req.body);

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

// PATCH
// async (req, res, next) => {
//   try {
//     const project = await Projects.update(req.params.id, req.body);

//     if (project) {
//       return res
//         .status(200)
//         .json({ status: 'success', code: 200, data: { project } });
//     }

//     return res
//       .status(404)
//       .json({ status: 'error', code: 404, message: 'Project Not Found' });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = { getAll, getById, create, remove, update };

/**
 * Controllers
 */
