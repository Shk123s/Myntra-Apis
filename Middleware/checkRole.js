const {Roles} = require("../Utilis/Roles");

exports.CheckRole = (res, Role,userDetails) => {
   
    if (Role === 0) {
        userDetails.role = "superadmin"
        return   res.status(200).send({
        message: "Welcome back Superadmin",
        userDetails: userDetails,
      });
    } else if (Role === 1) {
        userDetails.role = "admin"
     return res.status(200).send({
        message: "Welcome back admin",
        userDetails: userDetails,
      });
    } else {
        userDetails.role = "user"
    return  res.status(200).send({
        message: "Welcome back User",
        userDetails: userDetails,
      });
    } 
  };