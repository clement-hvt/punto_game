const express = require('express');
const gamesController = require('../controllers/games');
const router = express.Router();

router.route('/subscribe')
    .post(gamesController.addPlayerToGame)
router.route('/new')
    .post(gamesController.create)
router.route('/start')
    .post(gamesController.start)
router.route('/nextCard')
    .get(gamesController.getNextCard)

module.exports = router;