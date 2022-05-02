import express from 'express';
import * as ApiController from '../controllers/ApiController';
const router = new express.Router();

router.post('/addCrypto', ApiController.addCrypto);
router.put('/changeCryptoRate', ApiController.changeCryptoRate);
router.post('/addUser', ApiController.addUser);
router.put('/addCurencyToUser', ApiController.addCurencyToUser);
router.put('/disableUserNotificationState',
    ApiController.disableUserNotificationState);
router.put('/enableUserNotificationState',
    ApiController.enableUserNotificationState);
router.get('/fetchUsers', ApiController.fetchUsers);
router.get('/fetchCryptos', ApiController.fetchCryptos);
export default router;
