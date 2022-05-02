import adminFireBase from 'firebase-admin';


import serviceAccount from '../../../crypto-bc5ea-firebase-adminsdk-p2jt7-bb19b95f0e.json';

export const firebase = adminFireBase.initializeApp({
  credential: adminFireBase.credential.cert(serviceAccount),
});
