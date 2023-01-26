const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.route('/signin')
    .post(authController.connection)
router.route('/signinWithToken')
    .post(authController.connectionWithToken)

module.exports = router;