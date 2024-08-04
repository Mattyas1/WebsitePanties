import './config/env.mjs'
import express from "express";
import passport from 'passport';
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import mainRouter from "./routes/mainRouter.mjs";
import newUserRouter from "./routes/newUser.mjs";
import { routerWithoutSession } from "./routes/auth.mjs";
import cors from "cors";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from "url";
import { initializeScheduledTasks } from './utils/auctionfunctions.mjs';
import './websocket/websocketServer.mjs'

const SESSION_SECRET = process.env.SESSION_SECRET
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

initializeScheduledTasks();

app.use(cors({
    origin: ['http://localhost:3000', 'http://172.21.250.201:3000'],
    credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());

app.use(cookieParser());

app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { httpOnly: true, maxAge: 3600000 },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(newUserRouter);
app.use(routerWithoutSession);
app.use(mainRouter);

const PORT = process.env.PORT || 3001;
const IP_ADDRESS = 'localhost';

app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server running on http://${IP_ADDRESS}:${PORT}`);
});
