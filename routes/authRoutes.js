const {Router} = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.get('/', authController.home_get)

router.get('/signup', authController.signup_get)

router.post('/signup',  authController.signup_post)

router.get('/login', authController.login_get)

router.post('/login',  authController.login_post)

router.get('/appoinments', authMiddleware.authenticateToken , authController.appoinments)

module.exports = router;