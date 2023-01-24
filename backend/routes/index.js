const express = require('express');
const usersRouter = require("./users");
const gamesRouter = require("./games");
const gameMoveRouter = require("./gameMoves");
const router = express.Router();

router.use('/users', usersRouter);
router.use('/games', gamesRouter);
router.use('/gameMoves', gameMoveRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("to");
});


module.exports = router;
