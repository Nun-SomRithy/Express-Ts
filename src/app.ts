import express, {NextFunction} from "express";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import cors from "cors";
import UserRoutes from "./routes/userRoutes";
import NoteRouter from "./routes/noteRoutes";

const app = express();
app.use(morgan("dev"))
app.use(express.json())
// app.use('/api/note', NoteRouter);
app.use(cors());

app.use('/users', UserRoutes);

app.use('/notes',NoteRouter)

app.use((req, res, next) => {
    next(createHttpError(404, "The endpoint not found "))
})
// @ts-ignore
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "Unknown the Error Type";
    let statusCode = 500;
    if (isHttpError(error)){
        errorMessage= error.message;
        statusCode= error.statusCode;
    }
    // @ts-ignore
    res.status(statusCode).json({error : errorMessage})
})
export default app;