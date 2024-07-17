const express = require("express");
const app = express();
const allroutes = require("./Routes/allRoutes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require('path')
const fs = require("fs");
require('dotenv').config();

app.use(bodyParser.json({ type: "application/json" }));
app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) // Log to a file
}));

app.get("/", (req, res) => res.json("Backend is up now!"));
app.use('/',allroutes);


let port = process.env.PORT || 4000 ;
app.listen(port, () => {
  console.log("3000 server started");
});
