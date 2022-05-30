const { promisify } = require('util')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
   })
}

const createSendToken = (user, statusCode, res) => {
   const token = signToken(user._id);

   const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      /* sameSite: 'none',
      secure: true */
      httpOnly: true
   }

   if (process.env.NODE_ENV === 'production') {
      cookieOptions.sameSite = 'none',
         cookieOptions.secure = true
   }

   res.cookie('jwt', token, cookieOptions)

   user.pin = undefined;
   user._id = undefined;

   res.status(statusCode).json({
      status: 'success',
      token,
      data: {
         user
      }
   })
}

exports.signup = catchAsync(async (req, res, next) => {
   const { name, account, pin, pinConfirm } = req.body

   const newUser = await User.create({
      name, account, pin, pinConfirm
   })

   createSendToken(newUser, 201, res);
})

exports.login = catchAsync(async (req, res, next) => {
   const { name, pin } = req.body;

   if (!name || !pin) {
      return next(new AppError('Please provide name and pin!', 400));
   }

   const user = await User.findOne({ name }).select('+pin -__v')
   /* .populate('movements') */

   if (!user || !(await user.correctPin(pin, user.pin))) {
      return next(new AppError('Invalid username or pin', 401));
   }

   createSendToken(user, 200, res);
})

exports.logout = (req, res) => {
   res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      sameSite: 'none',
      secure: true
   })

   res.status(200).json({ status: 'success' });
}

exports.protect = catchAsync(async (req, res, next) => {
   let token;

   if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
   }

   if (!token) {
      return next(
         new AppError('You are not logged in! Please log in to get access.', 401)
      );
   }

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

   const currentUser = await User.findById(decoded.id);
   if (!currentUser) {
      return next(
         new AppError(
            'The user belonging to this token does no longer exist.',
            401
         )
      )
   }

   req.user = currentUser;
   next()
})


exports.isAdmin = (req, res, next) => {
   next(new AppError(
      'You do not have permission to perform this action',
      401
   ))
}