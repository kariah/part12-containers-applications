
const express = require('express');
const router = express.Router(); 
const redis = require('../redis')

router.get('/', async (_, res) => {
    // const todos = await Todo.find({})
    // res.send(todos);
});

// router.get('/', async (req, res) => { 
  
//     // console.log('req.todo (get) ', req.todo)
  
//     // res.send(req.todo)   

//     const result = await redis.getAsync("todos");
//     console.log('todos 2', result)  
//   });