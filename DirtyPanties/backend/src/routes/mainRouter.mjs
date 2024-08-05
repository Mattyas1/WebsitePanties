import Router from "express"
import {authRouter} from "./auth.mjs"
import userRouter from "./user.mjs"
import productsRouter from "./products.mjs"
import bidsRouter from './bids.mjs'
import walletRouter from './wallet.mjs'
import partnerRouter from './partner.mjs'
import webhookRouter from './webhook.mjs'

const router = Router()

router.use(authRouter);
router.use(userRouter);
router.use(productsRouter);
router.use(bidsRouter);
router.use(walletRouter);
router.use(partnerRouter);
router.use(webhookRouter);

export default router;