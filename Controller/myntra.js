const express = require("express");
const connection = require("../database");
const multer = require("multer");
const reader = require("xlsx");
const path = require("path");
const geolocation = require('geolocation')
const moment = require("moment");
const Jimp = require("jimp");
const fs = require("fs");
const { CheckRole } = require("../Middleware/checkRole");
const { Roles } = require("../Utilis/Roles");
const csv = require("csv-parser");
const { transporter } = require("../mailer/mail");
const Joi = require("joi");
require("dotenv").config();

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
      res.status(404).send({ message: "no user found" });
    } else {
      res.status(200).send({ message: "user found", result: result });
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

    const userLogin  = Joi.object({
      email: Joi.string().required().messages({
        'any.required': 'email required ',
        'string.empty': 'missing parameter',
      }),
      password: Joi.string().required().messages({
        'any.required': 'password required ',
        'string.empty': 'missing parameter',
      }),
      
    });
    const { error } = userLogin.validate(req.body);
    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }
    const sqlquery = `select email,password,is_role from users where email=? and password =? `;
    const [results] = await connection.promise().query(sqlquery, [email, password]);
    if (results.length === 0 || results === null) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }
    const userEmail = results[0].email;
    const genrateotp = Math.floor(Math.floor(Math.random() * 8888 + 1111));
    const info = await transporter.sendMail({
      from: "shoppinganytime18@gmail.com",
      to: userEmail,
      subject: "Otp for Login",
      html: `<h1> Otp : ${genrateotp.toString()}</h1>`,
    });
    let updateOtp = `update users set  otp=? where  email =? `;
    const [updatedOtp] = await connection.promise().execute(updateOtp, [genrateotp, userEmail]);
      if (info.accepted.length > 0) {
        console.log(`Message sent to ${userEmail}: %s`,"this is id ", info.messageId);
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Log the IP address
        console.log('User IP Address:', userIp);
        return res.status(200).send({
          message: `OTP sent to ${userEmail}`,
        });
      } else {
        console.log(`Email sending failed for ${userEmail}`);
        return res.status(200).send({
          message: `Email sending failed for ${userEmail}`,
        });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
};
const userLoginOtp = async (req, res) => {
  const { otp } = req.body;
  let queryStrngotp = `select email,password,is_role from users where  otp =? `;
  const [matchedotp] = await connection.promise().query(queryStrngotp, [otp]);
  const userDetails = {
    email: matchedotp[0].email,
    password: matchedotp[0].password,
  };
  if (matchedotp) {
    return CheckRole(res, matchedotp[0].is_role, userDetails);
  } else {
    res.status(401).send({
      message: "Invalid otp",
    });
  }
};
const getallUser = async (req, res) => {
  try {
    const strquery =
      "select name, phone_no ,email,password,is_active from users ";
    const [result] = await connection.promise().query(strquery);
    if (result.length === 0) {
      res.status(404).send({ message: "no user found" });
    } else {
      res.status(200).send({ message: "user found", result: result });
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
      res.status(200).send({
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
    console.log(req.params);
    if (!user_id) {
      res.send({ message: "missing parameter" });
    } else {
      const query =
        "select userposts.id,userposts.content,userposts.post_date,users.name as username ,users.email,users.is_active,users.is_role,users.user_id from userposts inner join users on userposts.userid = users.user_id where users.user_id= ? ";

      const [result] = await connection.promise().query(query, [user_id]);
      if (result.length === 0) {
        res.status(400).send({ message: "no user  found of this post " });
      } else {
        res.status(200).send({
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
const addBulkPosts = async (req, res) => {
  try {
    const { content, post_date, userid } = req.body;

    let bulkdata = req.body;
    if (!Array.isArray(bulkdata) || bulkdata.length === 0) {
      return res.status(400).send({ message: "Invalid request " });
    }
    // const values = bulkdata.map(post => [post.content, post.post_date, post.userid]);
    // console.log(bulkdata);
    let values = [];
    for (let i = 0; i < bulkdata.length; i++) {
      values.push([
        bulkdata[i].content,
        bulkdata[i].post_date,
        bulkdata[i].userid,
      ]);
    }
    const sqlquery =
      "insert into userposts(content,post_date,userid) values ? ";

    console.log(values);
    const [result] = await connection.promise().query(sqlquery, [values]);
    // .query(sqlquery, [values.flat()]);
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

const approvedPosts = async (req, res) => {
  try {
   
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
        to: resultemail[0].email, // list of receivers
        subject: "Post approved ✔", // Subject line
        html: "<h1>welcome </h1>", // html body
        attachments: [
          {
            filename: "offer letter",
            path: "D:/codingfile/MyntraMvp/demo.pdf",
          },
        ],
      });
      console.log("Message sent: %s", info.messageId);
      console.log("done sending mail", info);
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
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      result: error,
    });
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
    // cb(null, path.join(__dirname,"../images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
upload = multer({ storage: storage });

const UploadExcel = async (req, res) => {
  try {
    const allowedFileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!req.file) {
      res.status(400).send({ message: `Excel File required ` });
    } else if (!allowedFileTypes.includes(req.file.mimetype)) {
      res.status(400).send({
        message: "Invalid file type. Allowed types: Excel (csv,xls, xlsx).",
      });
    } else {
      const objects = [];

      function csv_to_array_of_objects(csv_file) {
        return new Promise((resolve, reject) => {
          fs.createReadStream(csv_file)
            .pipe(csv())
            .on("data", (row) => {
              objects.push(row);
            })
            .on("end", () => {
              resolve(objects);
            })
            .on("error", (error) => {
              reject(error);
            });
        });
      }
      let values;

      csv_to_array_of_objects(req.file.path)
        .then((objects) => {
          const bulkdata = objects;
          values = [];

          bulkdata.forEach((obj) => {
            const dateFormatted = moment(obj.Date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            );
            const currentTime = moment().format("HH:mm:ss");
            const exactTime = dateFormatted + " " + currentTime;

            values.push([
              obj.sr,
              obj.FirstName,
              obj.LastName,
              obj.Gender,
              obj.Country,
              obj.Age,
              exactTime,
              obj.Id,
            ]);
          });

          const filteredvalue = values.flat();
          const sqlquery =
            "insert into exceluplaoddata(sr , firstname, lastname ,gender,country,age,date,userid) values (?) ";

          return connection.promise().query(sqlquery, [filteredvalue]);
        })
        .then(([result]) => {
          if (result.affectedRows == 0) {
            res.status(200).send({ message: "not created" });
          } else {
            res.status(200).send({ message: "Done", result: result });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "internal error" });
  }
};

const generatecertificate = async (req, res, next) => {
  try {
    if (!req.files[1]) {
      res.status(400).send({ message: `Excel File required ` });
    } else {
      const file = reader.readFile(req.files[1].path);
      let data = [];

      let sheets = file.SheetNames;

      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );
        temp.forEach((res) => {
          data.push(res);
        });
      }
      let bulkdata = data;
      let names = [];
      let emails = [];
      let values = [];
      for (let i = 0; i < bulkdata.length; i++) {
        names.push([bulkdata[i].FirstName + " " + bulkdata[i].LastName]);
        emails.push([bulkdata[i].email]);
        values.push([
          bulkdata[i].FirstName + " " + bulkdata[i].LastName,
          bulkdata[i].email,
        ]);
      }
      const Imagepath = req.files[0].path;
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
      for (let i = 0; i < names.length; i++) {
        const image = await Jimp.read(Imagepath);
        const nameArray = names[i].toString();
        const emailArray = emails[i];
        const textWidth = Jimp.measureText(font, nameArray);
        const centerX = (image.bitmap.width - textWidth) / 2;
        const centerY =
          (image.bitmap.height - Jimp.measureTextHeight(font, nameArray)) / 2;
        const generatedImage = `writttenamed_${i}.png`;
        sentimage = image
          .print(font, centerX, centerY, nameArray)
          .write(generatedImage);
        values[i].push(generatedImage);
        const info = await transporter.sendMail({
          from: "shoppinganytime18@gmail.com",
          to: emailArray,
          subject: "your certificate ✔",
          html: "<h1>Congrats </h1>",
          attachments: [
            {
              filename: "Certificate.jpg",
              path: `writttenamed_${i}.png`,
            },
          ],
        });
        if (info.accepted) {
          console.log(`Message sent to ${emailArray}: %s`, info.messageId);
        } else {
          console.log(`Email sending failed for ${emailArray}`);
        }
      }
      const sqlquery =
        "insert into certificates( certificate_name, certificate_email,certificate_path ) values ? ";

      const [result] = await connection.promise().query(sqlquery, [values]);

      if (result.affectedRows == 0) {
        res.status(200).send({ message: "not created" });
      } else {
        res.status(200).send({ message: "Done", result: result });
      }
    }
  } catch (error) {
    res.send({
      message: "Internal server error",
    });
    console.error(error);
  }
};

const getCategoryWithSubcategoryProductAll = async (req, res, next) => {
  try {
    const getCategoryWithSubcategoryProductAll = Joi.object({
      id: Joi.string().required().messages({
        "any.required": "CategoryId required ",
        "string.empty": "missing parameter",
      }),
    });
    const { error } = getCategoryWithSubcategoryProductAll.validate(req.params);
    //* Category id passed
    const { id } = req.params;

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    } else {
      const sqlquery = `select *  from categories 
      inner join 
      subcategories  ON categories.id = subcategories.CategoryID
      inner join products on 
      subcategories.id = products.SubCategoryID  where categories.id = ${id} ;`;
      const [results] = await connection.promise().execute(sqlquery, [id]);

      let finalcategory = [];
      let finalproduct = [];
      results.forEach((data) => {
        const subCategory = {
          SubCategoryID: data.SubCategoryID,
          subcategoryName: data.subcategoryname,
        };
        finalcategory.push(subCategory);
        const product = {
          id: data.product_id,
          name: data.name,
          type: data.type,
          description: data.description,
          price: data.price,
          is_active: data.is_active,
          SubCategoryID: data.SubCategoryID,
        };
        finalproduct.push(product);
      });
      if (
        !finalcategory ||
        finalcategory.length == 0 ||
        !finalproduct ||
        finalproduct.length == 0
      ) {
        res
          .status(409)
          .send({
            success: false,
            message: "category with this subcategory No product found!",
          });
      } else {
        res.status(200).send({
          message: "category with subcategory and product list ",
          subCategory: finalcategory,
          product: finalproduct,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
};
const getSubcategorywithProductAll = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.params.id) {
      res.status(400).send({
        message: "missing parameter",
      });
    } else {
      const sqlquery = `select *  from subcategories 
      inner join products on 
      subcategories.id = products.SubCategoryID  where subcategories.id = ${id} ;`;
      const [results] = await connection.promise().execute(sqlquery, [id]);

      if (!results || results.length === 0) {
        res.status(404).send({ message: "No products found " });
      } else {
        res.status(200).send({
          message: "subcategory and product list ",

          result: results,
          Toatalcount: results.length,
        });
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
const getProductAll = async (req, res, next) => {
  try {
    const sqlquery = `select *  from products`;
    const [results] = await connection.promise().execute(sqlquery);
    // only one join can also work
    const countsquery = `select   count(products.product_id) as count from products `;

    const [countresult] = await connection.promise().execute(countsquery);

    if (!results || results.length === 0) {
      res.status(404).send({ message: "No products found " });
    } else {
      res.status(200).send({
        message: "product list ",

        result: results,
        count: countresult[0].count,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
    //   console.log(error);
  }
};
const brandsAdd = async (req, res, next) => {
  try {
    const supplierSchema = Joi.object({
      companyName: Joi.string().min(3).max(255).required(),
      companyAddress: Joi.string().max(255).required(),
      companyPhone: Joi.string().min(7).max(15).required(),
      companyEmail: Joi.string().email().required(),
      website: Joi.string().uri().optional(),
      contactPerson: Joi.string().max(255).optional(),
      paymentTerms: Joi.string().max(50).optional(),
    });
    const { error } = supplierSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    }

    const {
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      website,
      contactPerson,
      paymentTerms,
    } = req.body;

    const query =
      "INSERT INTO suppliers (companyName, companyAddress, companyPhone, companyEmail, website, contactPerson, paymentTerms) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [companyAdd] = await connection
      .promise()
      .execute(query, [
        companyName,
        companyAddress,
        companyPhone,
        companyEmail,
        website,
        contactPerson,
        paymentTerms,
      ]);

    if (companyAdd.affectedRows == 1) {
      res
        .status(201)
        .send({
          success: true,
          message: "New supplier has been created successfully.",
        });
    } else {
      res.status(404).send({ message: "Not created supplier", result: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal error" });
  }
};
const brandsGetAll = async (req,res,next) =>{
  try {
    const brandGet = "select * from suppliers";

    const [brandGetresult] = await connection.promise().execute(brandGet);
    
    if (!brandGetresult || brandGetresult.length === 0) {
      res.status(404).send({ message: "No suppliers found " });
    } else {
      res.status(200).send({
        success:true,
        message: "suppliers list ",
        result: brandGetresult,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({success:false,message:"Internal server error"});
  }

}

module.exports  = {getProduct,userProduct,getProductId,getUser,addWishlist,updateWishlist,deleteWishlist,
  userLogin,userLoginOtp,getallUser,forgetpassword,resetpassword,userposts,addPosts,updatePosts,
  deleteUserPosts,SingleUserPosts,addBulkPosts,approvedPosts,storage,upload,UploadExcel
  ,generatecertificate,getCategoryWithSubcategoryProductAll,getSubcategorywithProductAll,getProductAll,brandsAdd,brandsGetAll}