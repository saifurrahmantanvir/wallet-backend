const User = require('../models/userModel')
const Movement = require('../models/movementModel')
const catchAsync = require('../utils/catchAsync')

exports.getMovements = catchAsync(async (req, res, next) => {
   const { account } = req.params

   const movements = await Movement.find({ user: account })

   res.status(201).json({
      status: 'success',
      data: {
         movements
      }
   })
})


exports.createMovement = catchAsync(async (req, res, next) => {
   const { account } = req.params
   const { movement } = req.body

   const newMovement = await Movement.create({
      movement,
      user: account
   })

   res.status(201).json({
      status: 'success',
      data: {
         movement: newMovement
      }
   })
})