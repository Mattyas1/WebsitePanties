import {Router} from "express";
import {NewUserValidationSchema } from "../utils/ValidationSchemas.mjs";
import "../strategies/local-strategy.mjs";
import { matchedData, validationResult} from "express-validator";
import {User} from "../mongoose/schemas/User.mjs"
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();


router.post("/api/newUser",
    NewUserValidationSchema,
    async (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) return res.status(400).send( {errors: result.array()});

    const data = matchedData(req)
    data.password = await hashPassword(data.password);

    const newUser = new User(data);
    try {
        await newUser.save();
        console.log("New user created :", newUser._id)
        return res.status(201).send(newUser);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    } 
});

export default router;