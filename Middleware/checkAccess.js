exports.middleware = (req, res, next) => {
    const { token } = req.headers;
    const user_id = 4;
    console.log(user_id, token);
  
    if (user_id && token === process.env.JWT_KEY) {
      next();
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  };
  exports.CheckAccess = async (req, res, next) => {
    const { user_id } = req.query;
    if (!user_id) {
      res.status(403).send({
        message: "No user_id provided",
      });
    } else {
      const checkadmin = "select  is_role from users where user_id =?;";
      const [result] = await connection.promise().execute(checkadmin, [user_id]);
      // console.log(result.length)
      if (result.length === 0) {
        res.status(403).send({
          message: "No userid is found",
          result: result,
        });
      } else if (result[0].is_role === 1) {
        console.log("admin");
        next();
      } else {
        res.status(403).send({
          message: "Forbidden",
          result: "oops! Not an admin",
        });
      }
    }
  };