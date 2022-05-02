import {Admin} from '../models';

export const checkAdmin = async ()=>{
  try {
    // you can refer here any other method to get count or number of record
    const count = await Admin.countDocuments({});

    if (count <= 0) {
      const user = {
        firstName: 'User',
        lastName: 'Admin',
        email: 'admin@crypto.com',
        password: '123456',
      };
      const admin = new Admin(user);
      await admin.save();
    }
  } catch (err) {
    console.log(err);
  }
};

