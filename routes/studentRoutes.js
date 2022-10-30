const router = require('express').Router() ; 
const studentController = require('../controllers/studentController')
const auth = require('../middleware/auth')

router.post('/register' , studentController.register)
router.get('/refreshtoken',studentController.refreshToken)
router.post('/login',studentController.login)

router.post('/addFavTeacher' , auth , studentController.addfavTeacher) ; 
router.post('/removeFavTeacher' ,auth ,  studentController.removefavTeacher) ; 
router.get('/mostFavTeacher' , studentController.mostfavTeacher) ; 



module.exports = router ; 