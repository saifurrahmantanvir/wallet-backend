const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
   const users = await User.find()

   res.status(200).json({
      status: 'success',
      data: {
         users
      }
   })
})

exports.getUser = catchAsync(async (req, res, next) => {
   const user = await User.findById(req.params.id).populate('movements')

   res.status(200).json({
      status: 'success',
      data: {
         user
      }
   })
})