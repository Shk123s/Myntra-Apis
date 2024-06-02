const mysql = require("mysql2");
require('dotenv').config();
const connection = mysql.createConnection({
    host:process.env.db_LOCALHOST,
    user:process.env.db_USERNAME,
     password:process.env.db_PASSWORD,
    database:process.env.db_DATABASE,
    port:process.env.db_PORT
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("db Connected!");
  
  });

module.exports=connection