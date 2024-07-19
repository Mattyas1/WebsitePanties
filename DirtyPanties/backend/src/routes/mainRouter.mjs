import Router from "express"
import {authRouter} from "./auth.mjs"
import userRouter from "./user.mjs"

const router = Router()

router.use(authRouter);
router.use(userRouter);

export default router;