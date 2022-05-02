import jwt from 'jsonwebtoken';
import {Admin} from '../models';


const authAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Admin.findOne(
        {'_id': decode._id, 'tokens.token': token},
        {
          firstName: 1,
          lastName: 1,
          email: 1,
        },
    ).lean();

    if (!user) {
      return res.status(401).send({error: 'user not found'});
    }
    next();
  } catch (e) {
    return res.status(401).send({error: 'Please authenticate'});
  }
};

module.exports = {authAdmin};
