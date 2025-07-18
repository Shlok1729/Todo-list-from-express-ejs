const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// In-memory "database"
let todos = [];

app.get('/', (req, res) => {
    const { priority } = req.query;
    let filteredTodos = todos;
    if (priority && priority !== 'all') {
        filteredTodos = todos.filter(todo => todo.priority === priority);
    }
    res.render('index', { todos: filteredTodos, filter: priority || 'all' });
});

app.post('/add', (req, res) => {
    const { task, priority } = req.body;
    if (!task.trim()) {
        return res.render('index', { todos, filter: 'all', alert: 'Task cannot be empty!' });
    }
    todos.push({
        id: Date.now(),
        task,
        priority: priority || 'medium'
    });
    res.redirect('/');
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { task, priority } = req.body;
    todos = todos.map(todo =>
        todo.id == id ? { ...todo, task, priority } : todo
    );
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id != id);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));