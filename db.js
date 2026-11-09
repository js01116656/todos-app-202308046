const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'todo_user',
    password: 'todo1234',
    database: 'todo_db'
});

db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
        return;
    }

    console.log('MySQL 연결 성공!');
});

module.exports = db;
