import mongoose from 'mongoose';
import {autoIncrement} from 'mongoose-plugin-autoinc';

const usersCryptoSchema = new mongoose.Schema({
  cryptoCurrency: {
    type: Number,
    ref: 'CryptoCurrency',
  },
  user: {
    type: Number,
    ref: 'User',
  },
}, {
  timestamps: true,
});


usersCryptoSchema.plugin(autoIncrement, {
  model: 'UsersCrypto',
  field: '_id',
  startAt: 1,
  incrementBy: 1,
  unique: true,
});

usersCryptoSchema.index({id: 1});

const UsersCrypto = mongoose.model('UsersCrypto', usersCryptoSchema);

export default UsersCrypto;
