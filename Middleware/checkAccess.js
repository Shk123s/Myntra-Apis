const connection = require('../database');
const jwt = require('jsonwebtoken');
const { getAllRolesWithPermissions } = require('./../Controller/auth/role');
const authenticated = (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from cookies
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

// exports.CheckAccess = async (req, res, next) => {
//   const { user_id } = req.query;
//   if (!user_id) {
//     res.status(403).send({
//       message: 'No user_id provided',
//     });
//   } else {
//     const checkadmin = 'select  is_role from users where user_id =?;';
//     const [result] = await connection.promise().execute(checkadmin, [user_id]);
//     console.log(result);
//     if (result.length === 0) {
//       res.status(403).send({
//         message: 'No userid is found',
//         result: result,
//       });
//     } else if (result[0].is_role === 1) {
//       console.log('admin');
//       next();
//     } else {
//       res.status(403).send({
//         message: 'Forbidden',
//         result: 'oops! Not an admin',
//       });
//     }
//   }
// };

// Middleware to check required permissions dynamically
const permissionMiddleware = (requiredPermissions, resource) => {
  return async (req, res, next) => {
    try {
      // Fetch the user's role from the database
      const query = 'SELECT * FROM roles WHERE id = ?';
      const [RoleResults] = await connection
        .promise()
        .execute(query, [req.user.is_role]);

      const allPermissions = await getAllRolesWithPermissions();

      const userPermissions = allPermissions[RoleResults[0].name];

      const resourcePermissions = userPermissions
        ? userPermissions[resource]
        : null;

      if (!resourcePermissions) {
        return res
          .status(403)
          .json({ message: 'Access denied: no permissions for this resource' });
      }
      const hasPermission = requiredPermissions.every((permission) =>
        resourcePermissions.includes(permission)
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: 'Access denied: insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Error in permissionMiddleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { permissionMiddleware, authenticated };
