const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const bcrypt = require('bcrypt')

app.use(express.json())

let appoinments;

fetch('http://localhost:3000/appoinments?id=2')
.then(res => res.json())
.then(data => appoinments = data)

app.get('/appoinments', (req, res) => {
 res.json(appoinments)
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
   res.send('Success')
  } else {
   res.send('Not Allowed')
  }
 } catch(err) {
  console.log(err)
  res.status(500).send()
 }
})

app.listen(8080)