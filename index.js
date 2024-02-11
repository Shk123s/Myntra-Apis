
const express = require("express");
const app = express();
const myntra = require('./myntra');
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "application/json" }));


app.use('/',myntra);



app.listen(3000, () => {
  console.log("3000 server started");
});
