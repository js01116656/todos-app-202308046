
const express = require('express');
const router = express.Router();
const db = require('../db');

// 목록 조회 및 필터
router.get('/', (req, res) => {
    const filter = req.query.filter || 'all';

    let sql = 'SELECT * FROM todos';

    if (filter === 'completed') {
        sql += ' WHERE completed = 1';
    } else if (filter === 'active') {
        sql += ' WHERE completed = 0';
    }

    sql += ' ORDER BY id DESC';

    db.query(sql, (err, todos) => {
        if (err) return res.status(500).send('조회 실패');
        res.render('todos', { todos, filter });
    });
});

// 등록
router.post('/', (req, res) => {
    const { title, due_date } = req.body;

    if (!title || !title.trim()) {
        return res.redirect('/todos');
    }

    const sql = 'INSERT INTO todos (title, due_date) VALUES (?, ?)';

    db.query(sql, [title.trim(), due_date || null], (err) => {
        if (err) return res.status(500).send('등록 실패');
        res.redirect('/todos');
    });
});

// 완료 체크
router.post('/:id/toggle', (req, res) => {
    const sql = 'UPDATE todos SET completed = NOT completed WHERE id = ?';

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).send('수정 실패');
        res.redirect('/todos');
    });
});

// 수정 화면
router.get('/:id/edit', (req, res) => {
    db.query('SELECT * FROM todos WHERE id = ?', [req.params.id],
        (err, results) => {
            if (err) return res.status(500).send('조회 실패');

            if (results.length === 0) {
                return res.status(404).send('할 일이 없습니다.');
            }

            res.render('edit', { todo: results[0] });
        }
    );
});

// 수정
router.post('/:id/edit', (req, res) => {
    const { title, due_date } = req.body;

    if (!title || !title.trim()) {
        return res.redirect(`/todos/${req.params.id}/edit`);
    }

    const sql = 'UPDATE todos SET title = ?, due_date = ? WHERE id = ?';

    db.query(sql, [title.trim(), due_date || null, req.params.id], (err) => {
        if (err) return res.status(500).send('수정 실패');
        res.redirect('/todos');
    });
});

// 삭제
router.post('/:id/delete', (req, res) => {
    db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send('삭제 실패');
        res.redirect('/todos');
    });
});

module.exports = router;
