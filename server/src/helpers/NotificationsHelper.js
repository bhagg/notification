import {User, CryptoRateChange, NotificationsHistory} from '../models';
import moment from 'moment';
import {firebase} from './GeneralHelper';
import {chunk, map} from 'lodash';
export const notificationsByRateChange = async (cryptoId, newRate) =>{
  const difference12 = moment().subtract(12, 'hours').startOf('hour').toISOString();
  const difference12end = moment().subtract(12, 'hours').endOf('hour').toISOString();
  const last12Rate = await CryptoRateChange.findOne({
    cryptoCurrency: cryptoId,
    createdAt: {
      $gte: difference12,
      $lte: difference12end,
    },
  });

  const oldRate = last12Rate?.rate || 0;

  const change = newRate - oldRate;
  const percentageChange = oldRate ? Math.abs(change / oldRate * 100) : 0;
  if (percentageChange > 5) {
    const findNotNotifiedIn12Hours = await User.find(
        {pushToken: {$ne: null}, getNotifications: true},
    ).populate({
      path: 'usersCrypto',
      match: {
        cryptoCurrency: cryptoId,
      },
    }).populate({
      path: 'notifications',
      match: {
        type: 'rateChange',
        createdAt: {
          $gte: difference12,
        },
      },
    });

    const users = findNotNotifiedIn12Hours.filter((user) =>{
      return !user.notifications.length && user.usersCrypto.length;
    });

    const message = `Your holdings ${change < 0 ? 'decreased' : 'increased'} 
        in value by more than 
        ${parseFloat(percentageChange.toFixed(2))}% in the last 12 hours`;

    const targetedDevices = users.map((user) => user.pushToken);
    pushFunc(message, targetedDevices, users);
  }
};

export const notificationsBuyState = () =>{

};

export const notificationsBySellingState = () =>{

};


const pushFunc = (message, targetedDevices, users)=> {
  const title = 'Crypto Notification';
  const payload = {
    notification: {
      title,
      body: message,
      sound: 'default',
    },
    data: {
      title,
      body: message,
      sound: 'default',
    },
  };
  const options = {
    priority: 'high',
    sound: 'default',
    timeToLive: 60 * 60 *24,
  };
  try {
    const chunks = chunk(targetedDevices, 1000);

    const promises = map((chunks), (e, index) => {
      firebase.messaging().sendToDevice(e, payload, options)
          .then((response) => {
            const newNotification = new NotificationsHistory({
              message,
              type: 'rateChange',
              user: users[index * 999 + index]._id,
            });
            newNotification.save();
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
    });
    Promise.all(promises);
  } catch (e) {
    console.log(e);
  }
};

