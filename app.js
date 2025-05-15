const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let usuarios = [
  { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
  { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
  { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
  { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
  { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];

app.get('/', (req, res) => {
  res.send(`
    <h1>Página principal</h1>
    <ul>
      <li><a href="/users">Ver lista de usuarios</a></li>
      <li><a href="/newUser">Crear nuevo usuario</a></li>
    </ul>
  `);
});

app.get('/newUser', (req, res) => {
  res.send(`
    <h1>Crear usuario</h1>
    <form action="/users" method="POST">
      <label>Nombre:</label>
      <input type="text" name="nombre" required><br>
      <label>Edad:</label>
      <input type="number" name="edad" required><br>
      <label>Procedencia:</label>
      <input type="text" name="lugarProcedencia" required><br>
      <button type="submit">Crear</button>
    </form>
    <a href="/">Volver</a>
  `);
});

app.get('/users', (req, res) => {
  const listaUsuarios = usuarios.map(u =>
    `<li>ID: ${u.id} | ${u.nombre} (${u.edad} años) de ${u.lugarProcedencia}</li>`
  ).join('');
  
  res.send(`
    <h1>Lista de usuarios</h1>
    <ul>${listaUsuarios}</ul>
    <a href="/">Volver</a>
  `);
});

app.post('/users', (req, res) => {
  const { nombre, edad, lugarProcedencia } = req.body;

  if (!nombre || !edad || !lugarProcedencia) {
    return res.status(400).send('Faltan datos');
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    edad: parseInt(edad),
    lugarProcedencia
  };

  usuarios.push(nuevoUsuario);
  res.redirect('/');
});

app.get('/users/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const usuario = usuarios.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());

  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  res.json(usuario);
});

app.put('/users/:nombre', (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const index = usuarios.findIndex(u => u.nombre.toLowerCase() === nombre);

  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { edad, lugarProcedencia } = req.body;
  if (edad) usuarios[index].edad = parseInt(edad);
  if (lugarProcedencia) usuarios[index].lugarProcedencia = lugarProcedencia;

  res.json({ mensaje: 'Usuario actualizado', usuario: usuarios[index] });
});

app.delete('/users/:nombre', (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const usuario = usuarios.find(u => u.nombre.toLowerCase() === nombre);

  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  usuarios = usuarios.filter(u => u.nombre.toLowerCase() !== nombre);
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
