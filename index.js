
const express = require("express");
const app = express();
const allroutes = require("./Routes/allRoutes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require('path')
const fs = require("fs");

app.use(bodyParser.json({ type: "application/json" }));
app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) // Log to a file
}));

app.use('/',allroutes);



app.listen(3000, () => {
  console.log("3000 server started");
});
