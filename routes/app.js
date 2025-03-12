// app.js
import express from "express";
import cors from "cors";
import customerRouter from "../routes/customer/customerRouter.js";
import authRouter from "./authRouter.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";
import errorHandler from "../middlewares/errorHandler.js";

const app = express();
// Define CORS options
const corsOptions = {
  origin: "https://stripe-integration-test.myshopify.com", 
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/customer", customerRouter);

// Use the error handler middleware
app.use(errorHandler);

export default app;
