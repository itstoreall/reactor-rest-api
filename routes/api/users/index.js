const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/userController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login); // returns response with jwt-token
router.post('/logout', ctrl.logout);

module.exports = router;

/**
 * Router
 */
