import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {autoIncrement} from 'mongoose-plugin-autoinc';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import uuid4 from 'uuid4';

const adminSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuid4(),
    unique: true,
  },
  pic: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is Invalid');
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

// generateAthToken access to instances
adminSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign(
      {id: user.id.toString()},
      process.env.JWT_SECRET,
      {expiresIn: '24h'});
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
};

// hash password
adminSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


adminSchema.plugin(autoIncrement, {
  model: 'Admin',
  field: '_id',
  startAt: 1,
  incrementBy: 1,
  unique: true,
});

adminSchema.index({id: 1});
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;

