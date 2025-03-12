import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import passport from "../config/passport-config.js";
import { login } from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.use(passport.initialize());

//Login with email and password
authRouter.post("/login", authMiddleware, login);

export default authRouter;
