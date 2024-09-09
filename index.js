const express = require('express');
const app = express();
const allroutes = require('./Routes/allRoutes');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    }), // Log to a file
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.render('Home', {
    key: process.env.Publishable_Key,
  });
});
app.get('/', (req, res) => res.send('Backend is up now!'));
app.use('/', allroutes);

let port = 3000;
app.listen(port, () => {
  console.log(`${port} server started`);
});
