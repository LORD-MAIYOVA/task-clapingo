const router = require('express').Router() ; 
const teacherController = require('../controllers/teacherController')


router.post('/register' , teacherController.register)

module.exports = router ; 