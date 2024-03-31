const express = require("express");
const connection = require("./database");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json({ type: "routerlication/json" }));
const nodemailer = require("nodemailer");
Roles = {
  Admin: 1,
  Hr: 2,
  Employee: 3,
  Intern: 4,
};
//for email
const transporter = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "shaqeebsk1234@gmail.com",
  },
});
const CheckRole = (req, res, Role) => {
  // console.log("Role");
  if (Role[0].is_role === 1) {
    // console.log("object");
    res.status(200).send({
      message: "Welcome back admin",
      result: Role,
    });
  } else if (Role[0].is_role === 2) {
    // console.log("object");
    res.status(200).send({
      message: "Welcome back Hr",
      result: Role,
    });
  } else if (Role[0].is_role === 3) {
    // console.log("object");
    res.status(200).send({
      message: "Welcome back emoloyee",
      result: Role,
    });
  } else if (Role[0].is_role === 4) {
    res.status(200).send({
      message: "Welcome back Intern",
      result: Role,
    });
  } else {
    res.status(200).send({
      message: "Login successfully",
      result: Role,
    });
  }
  // console.log("object")
};

const getProduct = async (req, res) => {
  try {
    const { sortbyhigh, filters, startprice, endprice } = req.query;

    if (!req.query) {
      res.status(400).send({
        message: "missing parameter",
      });
    }
    // console.log(req.query)
    const setdata = [];
    let whereArray = [];
    if (filters) {
      setdata.push(` type="${filters}" `);
    }
    if (sortbyhigh) {
      whereArray.push(`order by price ${sortbyhigh} `);
    }
    if (startprice) {
      setdata.push(`price between ${startprice} and ${endprice} `);
    }

    testdta = `where ${setdata.join(" and ")}`;
    join = whereArray.join(" ");
    if (setdata.length === 0) {
      testdta = "";
    }

    const sqlquery = `select * from products  ${testdta} ${join} limit 20 OFFSET 0 `;
    const [results] = await connection
      .promise()
      .execute(sqlquery, [...setdata]);
    // console.log(sqlquery)
    const queryStrngCount = `select count(*) as count from (select * from products  ${testdta} ${join} limit 20 OFFSET 0 ) products`;
    const [resultsCount] = await connection.promise().query(queryStrngCount);
    if (!results || results.length === 0) {
      res.status(404).send({ message: "product not found" });
    } else {
      res.status(200).send({
        message: "product list ",
        result: results,
        TotalUsercount: resultsCount[0].count,
      });
      // console.log(results);
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
    console.log(error);
  }
};
const userProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.params.id) {
      res.status(400).send({
        message: "missing parameter",
      });
    } else {
      const sqlquery = `SELECT  users.name as username, users.user_id ,products.product_id,  products.name,products.description ,products.price,products.discount,
          products.rating,products.total_rating
            from wishlists  
          inner join users join products on wishlists.user_id=users.user_id and wishlists.product_id  = products.product_id where wishlists.user_id=? `;
      const [results] = await connection.promise().execute(sqlquery, [id]);
      // only one join can also work
      const countsquery =
        "select count(A.user_id) as count from wishlists as A inner join products as B on B.product_id = A.product_id  inner join users as C on C.user_id = A.user_id where C.user_id = ?;";
      const [countresult] = await connection
        .promise()
        .execute(countsquery, [id]);
      if (!results || results.length === 0) {
        res.status(404).send({ message: "No products found " });
      } else {
        res.status(200).send({
          message: "users product list ",
          result: results,
          count: countresult[0].count,
        });
        //   console.log(results);
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
    //   console.log(error);
  }
};
const getProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(req.params);
    if (!productId) {
      res.send({ message: "missing parameter" });
    }
    const strquery = `select products.product_id ,products.price 
    ,products.name,products.discount,products.description,products.rating ,
    product_sizes.size_id ,sizes.name as sizename
from products  left join  product_sizes    on products.product_id = product_sizes.product_id
 left join sizes on    product_sizes.size_id=sizes.size_id  where products.product_id=? `;
    const [result] = await connection.promise().query(strquery, [productId]);
    if (result.length === 0) {
      res.status(200).send({ message: "not found" });
    } else {
      res.status(500).send({ message: "found", result: result });
    }
  } catch (error) {
    console.log(error);
  }
};
const getUser = async (req, res) => {
  try {
    const { userid } = req.params;
    console.log(req.params);
    if (!userid) {
      res.send({ message: "missing parameter" });
    }
    const strquery =
      "select name, phone_no ,email,password,is_active from users where user_id=?";
    const [result] = await connection.promise().query(strquery, [userid]);
    if (result.length === 0) {
      res.status(200).send({ message: "no user found" });
    } else {
      res.status(500).send({ message: "user found", result: result });
    }
  } catch (error) {
    console.log(error);
  }
};
const addWishlist = async (req, res) => {
  try {
    const { user_id, product_id, is_active, is_deleted } = req.body;

    if (!user_id && !product_id && !is_active && !is_deleted) {
      res.status(400).send({
        message: "bad request",
      });
    }
    console.log(req.body);
    const sqlquery =
      "insert into wishlists(user_id,product_id,is_active,is_deleted) values(?, ? ,?, ?)";
    const [result] = await connection
      .promise()
      .execute(sqlquery, [user_id, product_id, is_active, is_deleted]);
    if (result.affectedRows == 0) {
      res.status(200).send({ message: "not created" });
    } else {
      res.status(200).send({ message: "Done", result: result });
    }
  } catch (error) {
    res.send({ message: "internal error" });
    console.log(error);
  }
};
const updateWishlist = async (req, res) => {
  try {
    // console.log(req.params)
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
      res.send({ message: "missing parameter" });
    }
    // console.log(req.body)
    let setData = [];
    let queryData = [];
    if (user_id) {
      setData.push("user_id=?");
      queryData.push(user_id);
    }
    if (product_id) {
      setData.push("product_id=?");
      queryData.push(product_id);
    }

    // console.log(queryData);
    // console.log(setData)
    const setString = setData.join(" and ");
    const sqlquery = `update wishlists set quantity=?  where ${setString}`;
    // console.log(sqlquery)
    const [result] = await connection
      .promise()
      .execute(sqlquery, [quantity, ...queryData]);

    if (result.affectedRows == 0) {
      res.status(404).send({ message: "not updated" });
    } else {
      res.status(200).send({ message: "Done succesfully", result: result });
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.query;
    console.log(req.query);
    if (!user_id && !product_id) {
      res.status(400).send({ message: "missing parameter" });
    }
    const sqlquery = "delete from  wishlists where user_id=? and product_id=?";
    const [result] = await connection
      .promise()
      .execute(sqlquery, [user_id, product_id]);
    if (result.affectedRows === 1) {
      res.status(200).send({ message: "product  deleted succesfully", result });
    } else {
      res.status(400).send({ message: "nothing deleted " });
    }
  } catch (error) {
    res.status(500).send({ message: "internal errror" });
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({
        message: "missing parameter",
      });
    } else {
      const sqlquery = `select email,password,is_role from users where email=? and password =? `;
      // console.log("sql")
      const [results] = await connection
        .promise()
        .execute(sqlquery, [email, password]);
      // console.log(results);
      if (results.length === 0) {
        return res.status(500).send({ message: "Invalid credentails" });
      }
      if (results) {
        return CheckRole(req, res, results);
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
    // console.log(error);
  }
};
const getallUser = async (req, res) => {
  try {
    const strquery =
      "select name, phone_no ,email,password,is_active from users ";
    const [result] = await connection.promise().query(strquery);
    if (result.length === 0) {
      res.status(200).send({ message: "no user found" });
    } else {
      res.status(500).send({ message: "user found", result: result });
    }
  } catch (error) {
    console.log(error);
  }
};

const forgetpassword = async (req, res) => {
  try {
    const otp = Math.floor(Math.floor(Math.random() * 8888 + 1111));
    const { email } = req.body;

    // console.log(otp);
    let queryStrngotp = `update users set  otp =${otp} where email = ? `;
    const [results] = await connection.promise().query(queryStrngotp, [email]);
    if (results.affectedRows === 1) {
      res.status(200).send({
        message: "otp sent",
        results,
      });
    } else {
      res.status(403).send({
        message: "Invalid email",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
const resetpassword = async (req, res) => {
  try {
    const { password, otp } = req.body;
    console.log(req.body);
    let queryStrngotp = `update users set  password = ? where  otp =? `;
    const [results] = await connection
      .promise()
      .query(queryStrngotp, [password, otp]);
    if (results.affectedRows === 1) {
      res.status(201).send({
        message: "password updated ",
        results,
      });
    } else {
      res.status(401).send({
        message: "Invalid otp",
      });
    }
  } catch (error) {
    res.status(201).send({
      message: "Internal server error",
    });
  }
};

const userposts = async (req, res) => {
  try {
    const strquery = "SELECT *  FROM userposts WHERE is_approved = 1 ;";
    const countsquery =
      "SELECT COUNT(*) as total_posts FROM userposts  WHERE is_approved = 1  ; ";

    const [result] = await connection.promise().query(strquery);
    const [resultcount] = await connection.promise().query(countsquery);
    if (result.length === 0) {
      res.status(400).send({ message: "no posts found" });
    } else {
      res
        .status(200)
        .send({
          message: "Hera are the posts",
          result: result,
          Total: resultcount,
        });
    }
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "Internal server error", result: error });
  }
};

const addPosts = async (req, res) => {
  try {
    const { content, post_date, userid } = req.body;

    if (!content && !post_date && !userid) {
      res.status(400).send({
        message: "bad request",
      });
    }
    // console.log(req.body);
    const sqlquery =
      "insert into userposts(content,post_date,userid) values(?, ? ,?)";
    const [result] = await connection
      .promise()
      .execute(sqlquery, [content, post_date, userid]);
    if (result.affectedRows == 0) {
      res.status(200).send({ message: "not created" });
    } else {
      res.status(200).send({ message: "Done", result: result });
    }
  } catch (error) {
    res.send({ message: "internal error" });
    console.log(error);
  }
};

const updatePosts = async (req, res) => {
  try {
    // console.log(req.params)
    const { content, post_date, userid } = req.body;

    if (!userid || !content || !post_date) {
      res.send({ message: "missing parameter" });
    }
    // console.log(req.body)
    let setData = [];
    let queryData = [];
    if (post_date) {
      setData.push("post_date=?");
      queryData.push(post_date);
    }
    if (content) {
      setData.push("content=?");
      queryData.push(content);
    }
    const setString = setData.join(" , ");
    // console.log(setString);
    const sqlquery = `update userposts set  ${setString}   where  userid=? `;
    // console.log(sqlquery)
    // console.log(...queryData)
    const [result] = await connection
      .promise()
      .execute(sqlquery, [...queryData, userid]);

    if (result.affectedRows == 0) {
      res.status(404).send({ message: "not updated" });
    } else {
      res.status(200).send({ message: "Done succesfully", result: result });
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    if (!id) {
      res.status(400).send({ message: "missing parameter" });
    }
    const sqlquery = "delete from  userposts where id=? ";
    const [result] = await connection.promise().execute(sqlquery, [id]);
    if (result.affectedRows === 1) {
      res.status(200).send({ message: "Post  deleted succesfully", result });
    } else {
      res.status(400).send({ message: "nothing deleted " });
    }
  } catch (error) {
    res.status(500).send({ message: "internal errror" });
  }
};
const SingleUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(req.params)
    if (!user_id) {
      res.send({ message: "missing parameter" });
    }
    else{
      const query =
      "select userposts.id,userposts.content,userposts.post_date,users.name as username ,users.email,users.is_active,users.is_role,users.user_id from userposts inner join users on userposts.userid = users.user_id where users.user_id= ? ";

    const [result] = await connection.promise().query(query, [user_id]);
    if (result.length === 0) {
      res.status(400).send({ message: "no user  found of this post " });
    } else {
      res
        .status(200)
        .send({
          message: "Hera are the posts of the users",
          result: result,
        });
    }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "internal error",
    });
  }
};

const approvedPosts = async (req, res) => {
  try {
    // console.log(req);
    // const {email} = req.headers
    // console.log(req.headers.email);
    const { id, userid } = req.body;
    if (!id && !userid) {
      res.status(406).send({
        message: " provide ids. ",
        result: result,
      });
    } else {
      // console.log(req.body);
      const approvedAdmin =
        "update userposts set is_approved = 1 where  id = ? and userid =?; ";
      // console.log(approvedAdmin);
      const [result] = await connection
        .promise()
        .query(approvedAdmin, [id, userid]);
      const emailquery = "select email from users where user_id=?";
        const [resultemail] = await connection
        .promise()
        .query(emailquery, [userid]);
        console.log(resultemail[0].email);

          // send mail with defined transport object
          const info = await transporter.sendMail({
           from: "shoppinganytime18@gmail.com", // sender address
          // to:email,
            to:  resultemail[0].email, // list of receivers
           subject: "Post approved ✔", // Subject line
           html: "<h1>welcome </h1>", // html body
           attachments:[{
            filename:"offer letter",
            path:"D:/codingfile/MyntraMvp/Job Offer Letter Professional Doc in White Grey Bare Minimal Style (1).pdf"
           }]
         });
         console.log("Message sent: %s", info.messageId);
         console.log("done sending mail",info)
         // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@gmail.com>
       
      if (result.affectedRows === 0) {
        res.status(406).send({
          message: " admin rejected the post. ",
          result: result,
        });
      } else {
        res.status(200).send({
          message: " admin approved the post. ",
          result: result,
        });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Internal server error",
      result: error,
    });
  }
};
const middleware = (req, res, next) => {
  const { token } = req.headers;
  const user_id = 4;
  console.log(user_id, token);

  if (user_id && token === "shaikh") {
    next();
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
};
const CheckAccess = async (req, res, next) => {
  const { user_id } = req.query;
  if (!user_id) {
    res.status(403).send({
      message: "No user_id provided",
    });
  } else {
    const checkadmin = "select  is_role from users where user_id =?;";
    const [result] = await connection.promise().query(checkadmin, [user_id]);
    // console.log(result.length)
    if (result.length === 0) {
      res.status(403).send({
        message: "No userid is found",
        result: result,
      });
    } else if (result[0].is_role === 1) {
      // console.log("admin");
      next();
    } else {
      res.status(403).send({
        message: "Forbidden",
        result: "oops! Not an admin",
      });
    }
  }
};
// const SendMail = async (req,res,next)=>{

//    try {
//      // send mail with defined transport object
//      const info = await transporter.sendMail({
//       from: "shoppinganytime18@gmail.com", // sender address
//       to:  "saddamsheikh357@gmail.com", // list of receivers
//       subject: "Post approved ✔", // Subject line
//       text: "Hello username ", // plain text body
//       html: "<h1>welcome </h1>", // html body
//     });
//     console.log("Message sent: %s", info.messageId);
//     console.log("done sending mail",info)
//     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@gmail.com>
    
//    } catch (error) {
//     console.log(error);
//    }
// }

// SendMail();
//send Mail 
// router.post("/v1/userssendMail", SendMail);
//users routes
router.get("/v1/users/login", userLogin);
router.post("/v1/users/forgetpassword", forgetpassword);
router.post("/v1/users/resetpassword", resetpassword);
router.get("/v1/user/:userid", middleware, CheckAccess, getUser);
router.get("/v1/users", middleware, CheckAccess, getallUser);
//wishlist each user
router.get("/v1/wishtlist/:id", userProduct);
router.post("/v1/wishlist", addWishlist);
router.put("/v1/wishlist", updateWishlist);
router.delete("/v1/wishlist", deleteWishlist);
// get product
router.get("/v1/product", middleware, getProduct);
router.get("/v1/product/:productId", getProductId);
//posts
router.get("/v1/userposts", userposts);
router.get("/v1/singleuserposts/:user_id", SingleUserPosts);
router.post("/v1/userposts", addPosts);
router.put("/v1/userposts", updatePosts);
router.delete("/v1/userpostsdelete/:id", CheckAccess, deleteUserPosts);
//user posts admin approval
router.put("/v1/approvalrequest", CheckAccess, approvedPosts);
// middleware
module.exports = router;
