import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load variables from ,env into process.env
dotenv.config();

// create express app
const app = express();

// allow frontend to call API during local development
app.use(cors());

// parse json request bodies
app.use(express.json());

// basic server health check
app.get("/health", (req, res) => {
    res.json({
        status:"ok",
    });
});

// start server
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});