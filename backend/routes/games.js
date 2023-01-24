const express = require('express');
const gamesController = require('../controllers/games');
const router = express.Router();

router.route('/subscribe')
    .post(gamesController.addPlayerToGame)
router.route('/')
    .post(gamesController.create)

module.exports = router;