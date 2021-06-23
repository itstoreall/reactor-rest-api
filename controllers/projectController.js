require('dotenv').config();
const ProjectModel = require('../model/projectModel');
const { HttpCode } = require('../helpers/constants');
const UploadImage = require('../services/uploadImagesLocal');
const {
  uploadConfig: { IMAGES_FOR_PROJECTS },
} = require('../config/configApp.json');

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
    const id = req.user.id;
    const uploads = new UploadImage(IMAGES_FOR_PROJECTS);

    // Save images to static (creates a personal folder)
    const imageUrl = await uploads.saveImageToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.filename,
      // oldFile: req.user,
    });

    /*
    console.log('img req.url-->', req.url); // /images
    console.log('img req.method-->', req.method); // PATCH
    console.log('img req.baseUrl-->', req.baseUrl); // /api/projects
    console.log('img req.originalUrl-->', req.originalUrl); // /api/projects/images
    console.log('img req.params-->', req.params); // {}
    console.log('img req.user-->', req.user); // everything about the user
    console.log('uploads-->', uploads); // UploadImages { IMAGES_FOR_PROJECTS: 'public/images' }
    */
    console.log('img req.file-->', req.file); // everything about the file
    console.log('imageUrl--> ', imageUrl);

    // await ProjectModel.updateAvatar(id, imageUrl);

    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { imageUrl },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getFiltered,
  getById,
  create,
  remove,
  update,
  images,
};

/**
 * Controllers
 *
 * - req.query (for mongoose pagination)
 */
