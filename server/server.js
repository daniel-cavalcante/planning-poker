import express from "express";
import connectToDatabase from "./database/database.js";
import logger from "./utils/logger.js";
import Table from "./models/tableModel.js";

const server = express();

connectToDatabase();

server.use(express.urlencoded({ extended: false })); // Why use this?
server.use(express.json()); // JSON parser.
server.use(logger);

// §TEST
import testingRouter from "./testing/testingRouter.js";
server.use("/api/tests/", testingRouter);

server.get("/", (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

server.listen(5000, () => {
  console.log("Server is listening on port 5000...");
});