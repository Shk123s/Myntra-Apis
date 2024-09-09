exports.CheckRole = (res, userDetails, token) => {
  if (userDetails.role === 0) {
    userDetails.role = 'superadmin';
    return res.status(200).send({
      message: 'Welcome back Superadmin',
      userDetails: userDetails,
      token: token,
    });
  } else if (userDetails.role === 1) {
    userDetails.role = 'admin';
    return res.status(200).send({
      message: 'Welcome back admin',
      userDetails: userDetails,
      token: token,
    });
  } else if (userDetails.role === 2) {
    userDetails.role = 'user';
    return res.status(200).send({
      message: 'Welcome back User',
      userDetails: userDetails,
      token: token,
    });
  }
};
