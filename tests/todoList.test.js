const fs = require('fs') 

let markup = fs.readFileSync("index.html").toString();

test('View Todo Items as Bullet points', () => {
  document.body.innerHTML = markup;
  const todolist = document.getElementById('todoList');
  expect(todolist.tagName).toBe('UL');
});

test('The font size of title of the app should be 40px', () => {
  document.body.innerHTML = markup;
  const appTitle = document.getElementById("appTitle");
  expect(appTitle.style.fontSize).toBe('40px');
})

test('Can add an item to the todo list', () => {
    document.body.innerHTML = markup;
    require('../script.js');
  
    const newTodoInput = document.getElementById('newTodo');
    const addTodoBtn = document.getElementById('addTodo');
    const todolist = document.getElementById('todoList');
  
    newTodoInput.value = 'New todo item';
    addTodoBtn.click();
  
    expect(todolist.innerHTML).toBe('<li>New todo item</li>');
});

