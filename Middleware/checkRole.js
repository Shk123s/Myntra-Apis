const { Roles } = require('../Utilis/Roles');

exports.CheckRole = (userDetails) => {
  if ((userDetails.role = Roles.admin)) {
    return {
      message: `Welcome back Admin`,
    };
  } else if ((userDetails.role = Roles.client)) {
    return {
      message: `Welcome back Client`,
    };
  } else if ((userDetails.role = Roles.user)) {
    return {
      message: `Welcome back User`,
    };
  }
};
