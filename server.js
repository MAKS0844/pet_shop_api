// --- КРОК 2: Отримання даних (READ) ---
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Дозволяє серверу розуміти дані у форматі JSON
app.use(express.json());

// 1. Налаштування підключення до бази даних
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Твій логін MySQL (зазвичай root)
    password: 'Maksym2104',      // Твій пароль MySQL (якщо є)
    database: 'pet_shop' // Назва твоєї бази даних
});

// Перевірка з'єднання
db.connect(err => {
    if (err) {
        console.error('Помилка підключення до БД:', err);
        return;
    }
    console.log('Підключено до бази даних pet_shop');
});

// GET - Отримати список усіх товарів
app.get('/products', (req, res) => {
    console.log('--- Запит отримано! Звертаюсь до бази даних... ---');

    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Помилка під час виконання запиту:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Дані отримано успішно. Кількість товарів:', results.length);
        res.json(results);
    });
});

// --- КРОК 3: CRUD для Клієнтів (CREATE, UPDATE, DELETE) ---

// POST - Додати нового клієнта
app.post('/customers', (req, res) => {
    const { full_name, phone_number } = req.body;
    const sql = 'INSERT INTO customers (full_name, phone_number) VALUES (?, ?)';
    
    db.query(sql, [full_name, phone_number], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Клієнта додано', id: results.insertId });
    });
});

// PUT - Оновити дані існуючого клієнта
app.put('/customers/:id', (req, res) => {
    const { full_name, phone_number } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE customers SET full_name = ?, phone_number = ? WHERE customer_id = ?';
    
    db.query(sql, [full_name, phone_number, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Дані клієнта оновлено' });
    });
});

// DELETE - Видалити клієнта
app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM customers WHERE customer_id = ?';
    
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Клієнта видалено' });
    });
});

/// Головна сторінка
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send('<h1>API Зоомагазину працює!</h1><p>Використовуйте /products для перегляду товарів.</p>');
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.lo(Сервер запущено: http://localhost:3000');
});

// Фінальна версія для Лабораторної №8