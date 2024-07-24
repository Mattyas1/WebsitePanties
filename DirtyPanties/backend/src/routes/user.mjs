import {Router} from "express";
import "../strategies/local-strategy.mjs";
import User from "../mongoose/schemas/User.mjs"

const router = Router();

router.post("/api/user/getUsername", async (req,res) => {
    console.log("SESSION USER :", req.session)
    try {
        const findUser = await User.findById(req.body.id);

        if (!findUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.status(201).send({username : findUser.username});
    } catch (err) {
        console.error("Error fetching username:", err);
        return res.status(500).send({ message: 'Internal Server Error' })
    }
});

export default router;