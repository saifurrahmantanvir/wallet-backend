const express = require('express')
const {
   signup,
   login,
   protect,
   logout,
   isAdmin
} = require('../controllers/authenticationController')
const { getAllUsers, getUser } = require('../controllers/userController')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/logout', protect, logout)

router.route('/').get(isAdmin, getAllUsers)
router.route('/:id').get(isAdmin, getUser)

module.exports = router;