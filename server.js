const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MySQL en XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // usualmente vacío en XAMPP
    database: 'c21100487'
});

// Verificar conexión
db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err.message);
    } else {
        console.log('Conexión a MySQL exitosa.');
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obtener todos los carros
app.get('/carros', (req, res) => {
    db.query('SELECT * FROM carros', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Agregar un nuevo carro
app.post('/carros', (req, res) => {
    const { marca, modelo, año, tipo_motor, precio_usd } = req.body;
    db.query(
        'INSERT INTO carros (marca, modelo, año, tipo_motor, precio_usd) VALUES (?, ?, ?, ?, ?)',
        [marca, modelo, año, tipo_motor, precio_usd],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId });
        }
    );
});

// Actualizar un carro existente
app.put('/carros/:id', (req, res) => {
    const { id } = req.params;
    const { marca, modelo, año, tipo_motor, precio_usd } = req.body;
    db.query(
        'UPDATE carros SET marca = ?, modelo = ?, año = ?, tipo_motor = ?, precio_usd = ? WHERE id = ?',
        [marca, modelo, año, tipo_motor, precio_usd, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Carro actualizado' });
        }
    );
});

// Eliminar un carro
app.delete('/carros/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM carros WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Carro eliminado' });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
