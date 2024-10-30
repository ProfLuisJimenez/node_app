const {Router} = require('express');
const validarToken = require('../utils/token');
const router = Router();

router.get("/ver", validarToken, async (req, res) => {
    try {
        const token = req.cookies.token;
        const respuestaServidor = await fetch('http://localhost:3000/api/list', {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!respuestaServidor.ok) {
            throw new Error('Error al acceder a la ruta protegida');
        }
        const data = await respuestaServidor.json();
        console.log('Datos recibidos:', data);
        res.render('lista', {lista: data, usuario: res.locals.usuario});
    } catch (error) {
        console.error('Error:', error);
        //res.status(500).send('Error al registrar');
        res.render('lista',{mensaje: error, usuario: res.locals.usuario});
    }
});

router.get("/registrar", validarToken, (req, res) => {
    res.render('registro');
});

router.post("/registrar", validarToken, async (req, res) => {
    const { nombre, password } = req.body;
    
    try {
        const token = req.cookies.token;
        const respuestaServidor = await fetch('http://localhost:3000/api/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, password })
        });

        if (!respuestaServidor.ok) {
            throw new Error('Error al acceder a la ruta protegida');
        }

        const data = await respuestaServidor.json();
        console.log('Datos recibidos:', data);
        res.render('registro', {mensaje: data.mensaje, usuario: res.locals.usuario});
    } catch (error) {
        console.error('Error:', error);
        //res.status(500).send('Error al registrar');
        res.render('registro',{message: error});
    }
});

module.exports = router;