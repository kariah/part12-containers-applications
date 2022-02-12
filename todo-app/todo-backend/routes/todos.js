const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')
let todos = 0

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
   
  todos++
  redis.setAsync('todos', todos)

  // const result = await redis.getAsync("todos");
  // console.log('todos', result)  
  
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params 
  req.todo = await Todo.findById(id)  

  if (!req.todo) return res.sendStatus(404)
  
  next()
}

const findByIdAndUpdateMiddleware = async (req, res, next) => {
  const { id } = req.params 
  req.todo = await Todo.findByIdAndUpdate(id)  

  const updatedTodo = await Todo.findOneAndUpdate({
    _id: id
  }, {
    text: req.body.text,
    done: req.body.done
  }, {
    new: true
  })

  if (!updatedTodo) return res.sendStatus(404)
 
  res.todo = updatedTodo 
   
  next() 
}


/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => { 
  
  console.log('req.todo (get) ', req.todo)

  res.send(req.todo)   
});
 
/* PUT todo. */
singleRouter.put('/', async (req, res) => {  

  console.log('req.todo (put) ', req.todo)

  res.send(res.todo)   
});
 

router.use('/:id', findByIdMiddleware, findByIdAndUpdateMiddleware, singleRouter)


module.exports = router;
