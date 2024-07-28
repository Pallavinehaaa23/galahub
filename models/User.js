const mongoose = require('mongoose');
const bcrypt= require("bcryptjs")
const jwt=require("jsonwebtoken")
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  } ,tokens: [{ // Array to store multiple tokens for multiple sessions
    token: {
      type: String,
      required: true
    }
  }]
});

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;