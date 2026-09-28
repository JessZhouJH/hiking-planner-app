import type {ErrorRequestHandler} from "express";

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;