const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/projectController');
const guard = require('../../../helpers/guard');

const {
  validateCreate,
  validateUpdate,
  validateUsed,
} = require('./projectValidation');

// GET
router.get('/', ctrl.getAll);

// GET by ID
router.get('/:id', ctrl.getById);

// POST
router.post('/', guard, validateCreate, ctrl.create);

// DELETE
router.delete('/:id', guard, ctrl.remove);

// PUT
router.put('/:id', guard, validateUpdate, ctrl.update);

// PATCH
router.patch('/:id/used', guard, validateUsed, ctrl.update);

module.exports = router;

/**
 * Router
 */
