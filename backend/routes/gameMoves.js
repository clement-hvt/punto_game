const express = require('express');
const gameMovesController = require('../controllers/gameMoves');
const router = express.Router();

router.route('/')
    .post(gameMovesController.addMove)

module.exports = router;