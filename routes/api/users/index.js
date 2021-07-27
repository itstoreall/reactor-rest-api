const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/userController');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login); // returns response with jwt-token
// router.post('/logout', ctrl.logout);
router.post('/logout', guard, ctrl.logout);
router.patch('/avatars', [guard, upload.single('avatar')], ctrl.cloudAvatars);

module.exports = router;

/**
 * Router
 *
 * - В Logout пускаем только зареганого пользователя (router через guard)
 *
 * - Avater:
 * - upload.single('avatar') - single может загружать одну или множество картинок
 * - upload.single('avatar') - avatar - значение тега name указанное в инпуте формы
 */
