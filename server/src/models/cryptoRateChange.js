import mongoose from 'mongoose';
import {autoIncrement} from 'mongoose-plugin-autoinc';

const cryptoRateChangeSchema = new mongoose.Schema({
  rate: {
    type: Number,
  },
  cryptoCurrency: {
    type: Number,
    ref: 'CryptoCurrency',
  },
}, {
  timestamps: true,
});


cryptoRateChangeSchema.plugin(autoIncrement, {
  model: 'CryptRateChange',
  field: '_id',
  startAt: 1,
  incrementBy: 1,
  unique: true,
});

cryptoRateChangeSchema.index({id: 1});

const CryptoRateChange = mongoose.model('CryptoRateChange',
    cryptoRateChangeSchema);

export default CryptoRateChange;
