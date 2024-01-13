import express from "express";
import cors from "cors";
import cookiePsrser from "cookie-parser";


const app = express();


//CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

// JSON SIZE LIMIT
app.use(
    express.json({
        limit: "16kb",
    })
);

//URL CONGIGURATION
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(
    express.static("public")
)

app.use(cookiePsrser())

import {userRouter} from '../src/routes/user.routes.js'
import { departmentRouter } from "./routes/department.routes.js";
import { programRoute } from "./routes/program.routes.js";
import {examFormRouter} from './routes/examForm.routes.js'

app.use("/api/v1/user",userRouter);
app.use("/api/v1/department",departmentRouter)
app.use("/api/v1/program",programRoute)
app.use("/api/v1/form",examFormRouter)
export { app };

