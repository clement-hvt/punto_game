const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")

/* GET users listing. */
router.get('/register', async function(req, res, next) {

  const User = mongoose.model('User')
  const clement = await User.findOne({username: 'clement'})
  res.type('json').send(JSON.stringify(clement));
});

module.exports = router;