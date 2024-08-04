import Router from "express"
import {authRouter} from "./auth.mjs"
import userRouter from "./user.mjs"
import productsRouter from "./products.mjs"
import bidsRouter from './bids.mjs'
import coinsRouter from './coins.mjs'
import partnerRouter from './partner.mjs'

const router = Router()

router.use(authRouter);
router.use(userRouter);
router.use(productsRouter);
router.use(bidsRouter);
router.use(coinsRouter);
router.use(partnerRouter);

export default router;