import rateLimit from "express-rate-limit";
import express from "express";
const app = express();

// Enable rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

export default loginLimiter;