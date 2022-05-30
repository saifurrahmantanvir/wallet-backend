const mongoose = require('mongoose')

const movementSchema = new mongoose.Schema({
   movement: {
      type: Number,
      required: [true, 'Movement can\'t be empty']
   },
   user: {
      type: Number,
      required: [true, 'A movement must belong to a user']
   },
   madeAt: {
      type: Date,
      default: Date.now()
   }
}, {
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
})

const Movement = mongoose.model('Movement', movementSchema)

module.exports = Movement