import express from 'express';
import adminRouter from './admin/indexRoutes.js';
import indexRouter from './clients/indexRouters.js';

const router = express.Router();

router.use('', indexRouter);
router.use('/admin', adminRouter);

export default router;




