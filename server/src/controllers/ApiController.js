import {CryptoCurrency,
  User,
  CryptoRateChange,
  UsersCrypto,
} from '../models';
import {notificationsByRateChange} from '../helpers/NotificationsHelper';

export const addUser = async (req, res)=> {
  const {
    firstName,
    lastName,
    email,
    pushToken,
  } = req.body;
  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      pushToken,
    });
    await newUser.save();
    return res.status(200).send({id: newUser.id});
  } catch (e) {
    console.log(e);
    return res.status(500).send('error');
  }
};

export const addCurencyToUser = async (req, res)=>{
  const {cryptoId, userId} = req.body;

  try {
    const findUser = await User.findOne({id: userId});
    const findCurrency = await CryptoCurrency.findOne({id: cryptoId});
    const newUserCrypto = new UsersCrypto({
      cryptoCurrency: findCurrency._id,
      user: findUser._id,
    });
    await newUserCrypto.save();
    return res.status(200).send('Updated');
  } catch (e) {
    console.log(e);
    return res.status(500).send('error');
  }
};

export const disableUserNotificationState = async (req, res)=>{
  const {userId} = req.body;
  try {
    await User.findOneAndUpdate({id: userId}, {getNotifications: false});
    return res.status(200).send('Updated');
  } catch (e) {
    return res.status(500).send('error');
  }
};
export const enableUserNotificationState = async (req, res)=>{
  const {userId} = req.body;
  try {
    await User.findOneAndUpdate({id: userId}, {getNotifications: true});
    return res.status(200).send('Updated');
  } catch (e) {
    return res.status(500).send('error');
  }
};

export const addCrypto = async (req, res) => {
  const {name, rate} = req.body;
  const newCrypto = new CryptoCurrency({name});
  await newCrypto.save();
  const newRate = new CryptoRateChange({
    rate,
    cryptoCurrency: newCrypto._id,
  });
  await newRate.save();
  return res.status(200).send({
    id: newCrypto.id,
  });
};

export const changeCryptoRate = async (req, res)=>{
  const {id, newRate} = req.body;
  try {
    const findCrypto = await CryptoCurrency.findOne({id});
    if (findCrypto) {
      const newRateChange = new CryptoRateChange({
        rate: newRate,
        cryptoCurrency: findCrypto._id,
      });
      await newRateChange.save();
      // send response and let the function run in the background
      res.status(200).send('Updated');
      // Sending Push notifications to users regarding rate change
      notificationsByRateChange(findCrypto._id, newRate);
    }
  } catch (e) {
    return res.status(500).send('Error');
  }
};

export const fetchCrypto = ()=>{

};

export const fetchUsers = async (req, res)=> {
  try {
    const users = await User.find({}).populate('usersCrypto notifications');
    return res.status(200).send(users);
  } catch (e) {
    return res.status(500).send('error');
  }
};

export const fetchCryptos = async (req, res)=> {
  try {
    const cryptosCurrencies = await CryptoCurrency.find({});
    return res.status(200).send(cryptosCurrencies);
  } catch (e) {
    return res.status(500).send('error');
  }
};
