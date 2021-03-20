const fetch = require('node-fetch')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.home_get = (req, res) => {
 console.log(req.user)
 res.render('home');
}

module.exports.signup_get = (req, res) => {
 res.render('signup');
}

module.exports.login_get = (req, res) => {
 res.render('login');
}

module.exports.signup_post = async (req, res) => {
 try {
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  await fetch("http://localhost:3000/users", {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify({'first_name': req.body.first_name, 'last_name': req.body.last_name, 'email': req.body.email, 'password': hashedPassword, 'birth_date': req.body.birth_date })
  })
  .catch(err => console.log(err))
 } catch(err) {
  console.log(err)
 }
}

module.exports.login_post = async (req, res) => {
 let user = await fetch(`http://localhost:3000/users?email=${req.body.email}`)
 .then(res => res.json())
 .then(data => data)

 if(user.length == 0) {
  return res.status(400).send('user not found')
 }

 try {
  if(await bcrypt.compare(req.body.password, user[0].password)) {
   const accessToken = jwt.sign(user[0], process.env.ACCESS_TOKEN_SECRET)
   res.cookie('jwt', accessToken)
   res.locals.islogged = true;
   res.send(user[0])
  } else {
   res.send('Not Allowed')
  }
 } catch(err) {
  console.log(err)
  res.status(500).send()
 }
}

module.exports.logout_get = (req, res) => {
 res.cookie('jwt', '', {maxAge:1})
 res.redirect('/')
}

let appoinments;
fetch('http://localhost:3000/appoinments')
.then(res => res.json())
.then(data => appoinments = data)

module.exports.appoinments = (req, res) => {
 res.render('appointments', {appoinments: appoinments.filter(post => post.id == req.user.id)})
}