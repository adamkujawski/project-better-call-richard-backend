import express = require("express");
import cors = require("cors");
import "express-async-errors";
import {json, Router} from "express";
import { handleError } from "./utils/errors";
import rateLimit from "express-rate-limit";
import { config } from "./config/config";
import { FaultRouter } from "./routers/fault.router";
import bodyParser from "body-parser";
import {loginRouter} from "./routers/login.router";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  })
);

app.use(json());
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const router = Router();
app.use('/api', router)

router.use("/fault", FaultRouter);
router.use("/login", loginRouter);

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
  })
);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
  console.log("Server litening on http://localhost:3001");
});
