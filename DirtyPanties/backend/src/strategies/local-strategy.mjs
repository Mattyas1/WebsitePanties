import passport from "passport"
import jwt from "jsonwebtoken"
import {Strategy} from "passport-local"
import User from "../mongoose/schemas/User.mjs"
import { comparePassword } from "../utils/helpers.mjs";
import {JWT_SECRET, JWT_REFRESH_SECRET} from "../config/constants.mjs"

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    try{
        const findUser = await User.findById(id);
        if (!findUser) throw new Error("User not found");
        done(null,findUser);
    } catch (err) {
        done(err, null)
    }
});

export default passport.use ( 
    new Strategy(async (username, password, done) => {
        try{
            const findUser = await User.findOne({ username });
            if (!findUser) throw new Error("User not found");
            if (! await comparePassword(password, findUser.password))
                throw new Error("Invalid Credentials");

            const accessToken = jwt.sign({ id: findUser._id, username: findUser.username }, JWT_SECRET, { expiresIn: '2h' });
            const refreshToken = jwt.sign({ id: findUser._id, username: findUser.username }, JWT_REFRESH_SECRET, { expiresIn: '200d' });

            findUser.refreshToken = refreshToken
            await findUser.save();

            done(null, {user: findUser, accessToken, refreshToken})
        } catch (err) {
            done(err, null);
        }
    })
);