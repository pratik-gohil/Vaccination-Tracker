require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const bcrypt = require('bcrypt')

app.use(express.json())

let appoinments;

fetch('http://localhost:3000/appoinments')
.then(res => res.json())
.then(data => appoinments = data)

app.get('/appoinments', authenticateToken, (req, res) => {
 res.json(appoinments.filter(post => post.id == req.user.id))
})

app.post('/signup', async (req, res) => {
 try {
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  await fetch("http://localhost:3000/users", {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify({'first_name': req.body.first_name, 'last_name': req.body.last_name, 'email': req.body.email, 'password': hashedPassword, 'age': req.body.age })
  })
  .catch(err => console.log(err))
 } catch(err) {
  console.log(err)
 }
})

app.post('/login', async (req, res) => {
 let user = await fetch(`http://localhost:3000/users?first_name=${req.body.first_name}`)
 .then(res => res.json())
 .then(data => data)

 if(user.length == 0) {
  return res.status(400).send('user not found')
 }

 try {
  if(await bcrypt.compare(req.body.password, user[0].password)) {
   // res.send('Success')
   const accessToken = jwt.sign(user[0], process.env.ACCESS_TOKEN_SECRET)
   res.json({accessToken})
  } else {
   res.send('Not Allowed')
  }
 } catch(err) {
  console.log(err)
  res.status(500).send()
 }
})

function  authenticateToken(req, res, next) {
 const authHeader = req.headers['authorization']
 const token = authHeader && authHeader.split(' ')[1]

 if(token == null) return res.status(401)

 jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  if(err) return res.status(403).send()
  req.user = user;
  next()
 })
}

app.listen(8080)