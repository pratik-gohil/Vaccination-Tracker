const {Router} = require('express')
const authController = require('../controllers/authController')
const {validateAuth} = require('../middlewares/validateMiddleware')

const router = Router()

router.get('/', authController.home_get)

router.get('/signup', authController.signup_get)

router.post('/signup',  authController.signup_post)

router.get('/login', authController.login_get)

router.post('/login',  authController.login_post)

router.get('/logout', authController.logout_get)

router.get('/appoinments', validateAuth , authController.appoinments)

module.exports = router;