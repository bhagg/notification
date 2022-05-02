import mongoose from 'mongoose';
import {autoIncrement} from 'mongoose-plugin-autoinc';

const notificationsHistorySchema = new mongoose.Schema({
  message: {
    type: String,
  },
  type: {
    type: String,
    enum: ['rateChange', 'order'],
  },
  user: {
    type: Number,
    ref: 'User',
  },
}, {
  timestamps: true,
});


notificationsHistorySchema.plugin(autoIncrement, {
  model: 'NotificationsHistory',
  field: '_id',
  startAt: 1,
  incrementBy: 1,
  unique: true,
});

notificationsHistorySchema.index({id: 1});

const NotificationsHistory = mongoose.model('NotificationsHistory',
    notificationsHistorySchema);

export default NotificationsHistory;
