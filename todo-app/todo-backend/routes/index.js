const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const redis = require('../redis')

let visits = 0

// router.get('/redis', async (req, res) => {
//   visits++

//   res.send({
//     ...configs,
//     visits
//   });
// });


/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});


module.exports = router;
