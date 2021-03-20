const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

var get_cookies = function(req) {
    var cookies = {};
    req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
  };

const validateAuth = (req, res, next) => {
  
 const token = get_cookies(req)['jwt']
 if(token) {
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    req.user = user;
    if(err) {
     console.log(err)
     res.redirect('/login')
    } else {
     next()
    }
   })
 } else {
  res.redirect('/login')
 }
}

module.exports = {validateAuth}