const express = require('express')
const { protect } = require('../controllers/authenticationController')
const { getMovements, createMovement } = require('../controllers/movementController')

const router = express.Router()

router.route('/:account')
   .get(getMovements)
   .post(protect, createMovement)


module.exports = router;