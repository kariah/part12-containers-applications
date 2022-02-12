const express = require('express');
const router = express.Router();

const configs = require('../util/config')

let visits = 0


const redis = require('../redis')

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});


module.exports = router;
