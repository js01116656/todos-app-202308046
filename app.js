const express = require('express');
const app = express();

const todoRoutes = require('./routes/todos');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    res.redirect('/todos');
});

app.listen(3000, () => {
    console.log('서버 실행: http://localhost:3000/todos');
});
