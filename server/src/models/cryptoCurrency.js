import mongoose from 'mongoose';
import {autoIncrement} from 'mongoose-plugin-autoinc';
import uuid4 from 'uuid4';

const cryptoCurrencySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuid4(),
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});


cryptoCurrencySchema.plugin(autoIncrement, {
  model: 'CryptoCurrency',
  field: '_id',
  startAt: 1,
  incrementBy: 1,
  unique: true,
});

cryptoCurrencySchema.index({id: 1});

const CryptoCurrency = mongoose.model('CryptoCurrency', cryptoCurrencySchema);

export default CryptoCurrency;

