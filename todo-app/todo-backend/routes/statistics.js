
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

// router.get('/', async (req, res) => { 
  
//     // console.log('req.todo (get) ', req.todo)
  
//     // res.send(req.todo)   

//     const result = await redis.getAsync("todos");
//     console.log('todos 2', result)  
//   });

module.exports = router;