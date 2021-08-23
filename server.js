const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors = require('cors')
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'jenolah',
    password: '',
    database: 'faceapp',
  },
})

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.listen(3004, () => {
  console.log('app running on port 3004')
})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt)
})

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db)
})

app.put('/image', (req, res) => {
  image.handleImage(req, res, db)
})

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res)
})

/*

/                this is working
/signin          POST success/fail
/register        POST return user
/profile/:userID GET return user
/image           PUT return user


*/
