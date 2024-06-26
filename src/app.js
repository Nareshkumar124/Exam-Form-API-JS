import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//CORS
app.use(
    cors({
        origin: true, // process.env.CORS_ORIGIN
        credentials: true,
    })
);

// JSON SIZE LIMIT
app.use(
    express.json({
        limit: "16kb",
    })
);

//URL CONFIGURATION
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(express.static("public"));

app.use(cookieParser());

import { userRouter } from "../src/routes/user.routes.js";
import { departmentRouter } from "./routes/department.routes.js";
import { programRoute } from "./routes/program.routes.js";
import { examFormRouter } from "./routes/examForm.routes.js";
import { adminRoute } from "./routes/admin.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/program", programRoute);
app.use("/api/v1/form", examFormRouter);
app.use("/api/v1/admin", adminRoute);
export { app };
