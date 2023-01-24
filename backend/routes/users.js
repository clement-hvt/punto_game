const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();

router.route('/')
    .post(usersController.register)
    .delete(usersController.delete)

module.exports = router;