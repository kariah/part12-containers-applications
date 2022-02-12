
const express = require('express'); 
const router = express.Router();
const redis = require('../redis')

router.get('/', async (_, res) => {  
    const result = await redis.getAsync("todos");
    //console.log('todos', result)  
    res.send({
        "added_todos": result,
      });
});

module.exports = router;