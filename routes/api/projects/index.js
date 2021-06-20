const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/projectController');

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
router.post('/', validateCreate, ctrl.create);

// DELETE
router.delete('/:id', ctrl.remove);

// PUT
router.put('/:id', validateUpdate, ctrl.update);

// PATCH
router.patch('/:id/used', validateUsed, ctrl.update);

module.exports = router;

/**
 * Router
 */
