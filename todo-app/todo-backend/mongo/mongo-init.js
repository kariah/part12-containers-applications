db.createUser({
  user: 'root',
  pwd: 'example',
  roles: [
    {
      role: 'dbOwner',
      db: 'database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });