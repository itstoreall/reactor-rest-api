const express = require('express');
const router = express.Router();
const limiter = require('../../../helpers/limiter');
const ctrl = require('../../../controllers/projectController');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');

const {
  validateCreate,
  validateUpdate,
  validateApi,
  validateUsed,
} = require('./projectValidation');

// GET
router.get('/', ctrl.getAll);

router.get('/filter', guard, limiter, ctrl.getFiltered);

// GET by ID
router.get('/:id', guard, ctrl.getById);

// POST
router.post('/', guard, validateCreate, ctrl.create);

// DELETE
router.delete('/:id', guard, ctrl.remove);

// PUT
router.put('/:id', guard, validateUpdate, ctrl.update);

// PATCH
router.patch('/:id/api', guard, validateApi, ctrl.update);
router.patch('/:id/used', guard, validateUsed, ctrl.update);

// IMAGES
router.patch('/images', [guard, upload.single('image')], ctrl.images);

module.exports = router;

/**
 * Router
 */
