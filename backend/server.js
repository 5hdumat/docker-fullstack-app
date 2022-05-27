// 필요한 모듈 가져오기
const express = require('express');
const { urlencoded } = require('express');
const db = require('./db');
const { Field } = require('mysql/lib/protocol/packets');

const app = express();

app.use(express.json());

// 테이블 생성하기
db.pool.query(
    `CREATE TABLE lists (
    id INTEGER AUTO_INCREMENT,
    value TEXT,
    PRIMARY KEY (id))`,
    (err, results, fields) => {
        console.log('results', results);
    },
);

// DB Lists 테이블에 있는 모든 데이터를 frontserver에 보내주기
app.get('/api/values', (req, res) => {
    db.pool.query('SELECT * FROM lists;', (err, results, fields) => {
        if (err) return res.status(500).send(err);
        else return res.json(results);
    });
});

app.post('/api/value', (req, res) => {
    db.pool.query(
        `insert into lists (value) values ("${req.body.value}")`,
        (err, results, fields) => {
            if (err) return res.status(500).send(err);
            else return res.json({ success: true, value: req.body.value });
        },
    );
});

app.use(urlencoded({ extended: false }));

app.listen(5000, () => {
    console.log('start application on port 5000');
});
