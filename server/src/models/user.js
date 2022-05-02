import mongoose from 'mongoose';
import {autoIncrement} from 'mongoose-plugin-autoinc';
import validator from 'validator';
import uuid4 from 'uuid4';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuid4(),
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
  pushToken: {
    type: String,
  },
  state: {
    type: String,
    default: 'active',
  },
  getNotifications: {
    type: Boolean,
    default: true,
  },
  tokens: [{
    token: {
      type: String,
    },
  }],
}, {
  timestamps: true,
});

userSchema.virtual('usersCrypto', {
  ref: 'UsersCrypto',
  localField: '_id',
  foreignField: 'user',
});
userSchema.virtual('notifications', {
  ref: 'NotificationsHistory',
  localField: '_id',
  foreignField: 'user',
});

userSchema.plugin(autoIncrement, {
  model: 'User',
  field: '_id',
  startAt: 1,
  incrementBy: 1,
  unique: true,
});

userSchema.index({id: 1});

const User = mongoose.model('User', userSchema);

export default User;

