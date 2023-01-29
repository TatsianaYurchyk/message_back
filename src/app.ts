import "dotenv/config";
import express, {NextFunction, Response, Request} from "express";
import userRoutes from "./routes/users";
import mailsRoutes from "./routes/mails";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import cors from 'cors';
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(cors())

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create ({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/users", userRoutes)
// app.use("https://mern-register.onrender.com/api/users", userRoutes)
app.use("/api/mails", requiresAuth, mailsRoutes);

app.use((req, res, next) => {
    next(createHttpError(404,"Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error:unknown, req: Request, res:Response, next:NextFunction)=>{
    console.error(error);
    let errorMessage = "An unknown error? occured";
    let statusCode = 500;
    if (isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error:errorMessage});
});

export default app;