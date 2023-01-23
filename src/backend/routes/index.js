const express = require('express');
const usersRouter = require("./users");
const router = express.Router();

router.use('/users', usersRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("to");
});


module.exports = router;
