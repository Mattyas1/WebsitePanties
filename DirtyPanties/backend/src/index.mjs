import express from "express";
import passport from 'passport';
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import mainRouter from "./routes/mainRouter.mjs";
import newUserRouter from "./routes/newUser.mjs";
import { routerWithoutSession } from "./routes/auth.mjs";
import cors from "cors"
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.connect("mongodb://localhost:27017/DirtyPanties");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(cors())

app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.json());

app.use(session({
    secret: "C8299PzxE7C679CguSA5dn3GFqnse",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000*60*10
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    }),
}));
app.use(passport.initialize());

app.use(newUserRouter);
app.use(routerWithoutSession);

app.use(passport.session());
app.use(mainRouter);

const PORT = process.env.PORT || 3001;
const IP_ADDRESS = 'localhost'

app.listen(PORT,IP_ADDRESS, () => {
    console.log(`Server running on http://${IP_ADDRESS}:${PORT}`);
});

