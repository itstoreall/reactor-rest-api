const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/userController');
const guard = require('../../../helpers/guard');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login); // returns response with jwt-token
router.post('/logout', guard, ctrl.logout);

module.exports = router;

/**
 * Router
 *
 * - В Logout пускаем только зареганого пользователя (router через guard)
 */
