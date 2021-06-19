const express = require('express');
const router = express.Router();
const Projects = require('../../model/projects');
const {
  validateCreate,
  validateUpdate,
  validateUsed,
} = require('./projectValidation');

// GET
router.get('/', async (req, res, next) => {
  try {
    const projects = await Projects.getAll();

    return res
      .status(200)
      .json({ status: 'success', code: 200, data: { projects } });
  } catch (error) {
    next(error);
  }
});

// GET by ID
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Projects.getById(req.params.id);

    console.log('toObject()-->', project); // toObject() *

    if (project) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { project } }); // toJSON() *
    }

    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Project Not Found' });
  } catch (error) {
    next(error);
  }
});

// POST
router.post('/', validateCreate, async (req, res, next) => {
  try {
    const project = await Projects.create(req.body);

    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { project } });
  } catch (e) {
    if (e.name === 'ValidationError') {
      e.status = 400;
    }
    next(e);
  }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const project = await Projects.remove(req.params.id);

    if (project) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { project } });
    }

    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Project Not Found' });
  } catch (error) {
    next(error);
  }
});

// PUT
router.put('/:id', validateUpdate, async (req, res, next) => {
  try {
    const project = await Projects.update(req.params.id, req.body);

    if (project) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { project } });
    }

    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Project Not Found' });
  } catch (error) {
    next(error);
  }
});

// PATCH
router.patch('/:id/used', validateUsed, async (req, res, next) => {
  try {
    const project = await Projects.update(req.params.id, req.body);

    if (project) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { project } });
    }

    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Project Not Found' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

/**
 * Router
 */
