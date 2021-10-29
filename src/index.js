const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(cors({ origin: true }))

let cont = null

app.get('/', (req, res) => {
  res.send('HOLA')
})

app.get('/connect', (req, res)=> {
  if(cont) {
    return res.send('Ya se encuentra conectado');
  }

  cont = mysql.createConnection({
    host: 'myql_bd',
    user: 'ger',
    password: '1234',
    database: 'bd1_ejemplo'
  });

  cont.connect((err) => {
    if (err) throw err;
    res.send('Se conecto')
  })
})

app.get('/table', (req, res) => {
  cont.connect((err) => {
    if (err) throw err;

    const commandSQL = `
    CREATE TABLE IF NOT EXISTS PRODUCTOS (
      ID INT NOT NULL AUTO_INCREMENT,
      NOMBRE VARCHAR(50) NOT NULL,
      ESTADO VARCHAR(20) DEFAULT 'disponible',
      PRECIO FLOAT DEFAULT 0.0
      PRIMARY KEY(ID)
    ) ENGINE=INNODB;
    `

    cont.query(commandSQL, (err, result) => {
      if (err) throw err;
      res.send('Tabla productos creada')
    })
  })
})

app.post('/', (req, res) => {
  const { nombre, estado, precio } = req.body

  if(!nombre) {
    return res.send('Falta el atributo nombre')
  }

  cont.connect((err) => {
    if (err) throw err;

    const commandSQL = `INSERT INTO PRODUCTOS (NOMBRE, ESTADO PRECIO) VALUES (${nombre},${estado},${precio})`

    cont.query(commandSQL, (err, result) => {
      if (err) throw err;
      res.send(`${nombre} se inserto en la tabla`)
    })
  })
})

app.listen(3000, () => console.log('SERVER PORT 3000'))