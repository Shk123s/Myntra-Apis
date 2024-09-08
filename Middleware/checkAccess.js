const connection = require('../database');
const jwt = require('jsonwebtoken');
exports.authenticated = (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from cookies
  console.log(token, 'token '); // Log the token for debugging
  if (token) {
    try {
      const decodedToken = jwt.verify(token, 'shhhhh');
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).send({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).send({ message: 'No token provided' });
  }
};

exports.CheckAccess = async (req, res, next) => {
  const { user_id } = req.query;
  if (!user_id) {
    res.status(403).send({
      message: 'No user_id provided',
    });
  } else {
    const checkadmin = 'select  is_role from users where user_id =?;';
    const [result] = await connection.promise().execute(checkadmin, [user_id]);
    console.log(result);
    if (result.length === 0) {
      res.status(403).send({
        message: 'No userid is found',
        result: result,
      });
    } else if (result[0].is_role === 1) {
      console.log('admin');
      next();
    } else {
      res.status(403).send({
        message: 'Forbidden',
        result: 'oops! Not an admin',
      });
    }
  }
};
