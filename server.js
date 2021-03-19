require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const bcrypt = require('bcrypt')

const authRoutes = require("./routes/authRoutes")

app.set('view engine', 'ejs')

app.use(express.json())

app.use(express.static('public'))

app.use(authRoutes)

app.listen(8080)