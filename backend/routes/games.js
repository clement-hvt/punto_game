const express = require('express');
const gamesController = require('../controllers/games');
const router = express.Router();

router.route('/subscribe')
    .post(gamesController.addPlayerToGame)

module.exports = router;