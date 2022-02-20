const Todo = ({ todo, info }) => { 
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
            <span>
              {todo.text} 
            </span>
            {info}
          </div>
      </>
    )
  }
  
  export default Todo
  