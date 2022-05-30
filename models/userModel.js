const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide your name']
   },
   account: {
      type: Number,
      unique: true,
      required: [true, 'Please provide an account number']
   },
   pin: {
      type: String,
      required: [true, 'Please provide your PIN']
   },
   pinConfirm: {
      type: String,
      required: [true, 'Please confirm your PIN'],
      validate: {
         validator: function (pin) {
            return pin === this.pin
         },
         message: 'PINs are not the same'
      }
   }
}, {
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
})

/* VIRTUAL REFERENCING
userSchema.virtual('movements', {
   ref: 'Movement',
   foreignField: 'user',
   localField: 'account'
})
*/

userSchema.pre('save', async function (next) {
   if (!this.isModified('pin')) return next()

   this.pin = await bcrypt.hash(this.pin, 12)
   this.pinConfirm = undefined;

   next()
})

userSchema.methods.correctPin = async function (candidatePin, userPin) {
   return await bcrypt.compare(candidatePin, userPin);
}

const User = mongoose.model('User', userSchema)

module.exports = User