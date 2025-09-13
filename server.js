const express = require('express');
const { pool, testConnection } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Probar la conexión a la base de datos al iniciar el servidor
testConnection();

// --- Rutas de la API ---

// Endpoint GET: Validar logueo

app.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'El correo y la contraseña son obligatorios.' });
  }

  try {
    // 1. Buscar al usuario por correo
    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    if (user.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 3. Inicio de sesión exitoso
    res.status(200).json({ message: 'Inicio de sesión exitoso.', user: { id: user.id, correo: user.correo } });

  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

// Endpoint GET: Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT  nombre,correo,rol FROM usuario');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Endpoint POST: Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  const { nombre,correo,contraseña,rol } = req.body;
  
  //if (!name || !correo) {
   // return res.status(400).json({ error: 'El nombre y el correo son obligatorios' });
  //}

  try {
    const [result] = await pool.query('INSERT INTO usuario  (nombre,correo,contraseña,rol) VALUES (?,?,?,?)', [nombre,correo,contraseña,rol]);
    res.status(201).json({ id: result.insertId, nombre,correo,rol });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});