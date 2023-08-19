const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Importing models
require('./models/Model');
require('./models/Post');

app.use(express.json());
app.use(cors());

// Importing routes
app.use(require("./routes/Auth"));
app.use(require("./routes/CreatePost"));
app.use(require('./routes/User'));

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("DATABASE CONNECTED OK");
});

// Serve static assets from the build folder
app.use(express.static(path.join(__dirname, "front", "build")));

// Send the index.html file for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front", "build", "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

mongoose.connection.on("error", (err) => {
  console.error("DATABASE CONNECTION ERROR:", err);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
