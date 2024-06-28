require("dotenv").config();

const express = require("express");
const Mongoose = require("mongoose");

const auth = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(express.json());

const saltRounds = 10;

Mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("    Error connecting to MongoDB", err);
  });

app.use("/api", auth);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
