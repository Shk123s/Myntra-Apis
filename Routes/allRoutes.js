const express = require('express');
const {
  getProduct,
  userProduct,
  getProductId,
  getUser,
  addWishlist,
  updateWishlist,
  deleteWishlist,
  userLogin,
  userLoginOtp,
  getallUser,
  forgetpassword,
  resetpassword,
  userposts,
  addPosts,
  updatePosts,
  deleteUserPosts,
  SingleUserPosts,
  addBulkPosts,
  approvedPosts,
  storage,
  upload,
  UploadExcel,
  generatecertificate,
  getCategoryWithSubcategoryProductAll,
  getSubcategorywithProductAll,
  getProductAll,
  brandsAdd,
  brandsGetAll,
  addCategory,
  addSubcategory,
  userGetAll,
  BulkProductAdd,
  contactMe,
} = require('../Controller/myntra');
const router = express.Router();
const {
  permissionMiddleware,
  authenticated,
} = require('../Middleware/checkAccess');
const {
  payment,
  success,
  cancel,
  refundPayment,
} = require('../Controller/payment');
const {
  fetchAllRoles,
  addRoles,
  addRolesAndPermission,
  fetchAllPermissions,
  fetchAllRolePermissions,
  getAllRolesWithPermissions,
  addResources,
} = require('../Controller/auth/role');

//auth admin routess;
router.get(
  '/v1/admin/getRoles',
  authenticated,
  permissionMiddleware(['view'], ['role']),
  fetchAllRoles
);

// add resources
router.post('/v1/addResources', addResources);
router.get('/v1/getPermissions', fetchAllPermissions);
router.get('/v1/getRolePermission', fetchAllRolePermissions);
router.get('/v1/getAllRolesWithPermissions', getAllRolesWithPermissions);
router.post('/v1/addRoles', addRoles);
router.post('/v1/addRolesPermission', addRolesAndPermission);
//users routes
router.get('/v1/userGetAll', authenticated, userGetAll);
router.post('/v1/users/login', userLogin);
router.post('/v1/users/userLoginOtp', userLoginOtp);
router.post('/v1/users/forgetpassword', forgetpassword);
router.post('/v1/users/resetpassword', resetpassword);
router.get('/v1/user/:userid', authenticated, permissionMiddleware, getUser);
router.get('/v1/users', authenticated, permissionMiddleware, getallUser);
//wishlist each user
router.get('/v1/wishtlist/:id', userProduct);
router.post('/v1/wishlist', addWishlist);
router.put('/v1/wishlist', updateWishlist);
router.delete('/v1/wishlist', deleteWishlist);

//category
router.get('/v1/categorywithproduct/:id', getCategoryWithSubcategoryProductAll);
router.post('/v1/AddCategory', addCategory);

//subcategory
router.get('/v1/subcategorywithproduct/:id', getSubcategorywithProductAll);
router.post('/v1/addSubcategory', addSubcategory);

//product
router.get('/v1/productAll', getProductAll);
router.get('/v1/product/:productId', getProductId);
// this getproduct contains filter and sorting
router.get('/v1/Allproduct', getProduct);
router.post('/v1/BulkProductAdd', upload.single('file'), BulkProductAdd);

//posts
router.get('/v1/userposts', userposts);
router.get('/v1/singleuserposts/:user_id', SingleUserPosts);
router.post('/v1/userposts', addPosts);
//bulk insert
router.post('/v1/bulkuserposts', addBulkPosts);
router.put('/v1/userposts', updatePosts);
router.delete('/v1/userpostsdelete/:id', permissionMiddleware, deleteUserPosts);
//user posts admin approval
router.put('/v1/approvalrequest', permissionMiddleware, approvedPosts);

//brandsAdd
router.post('/v1/supplierAdd', brandsAdd);
router.get('/v1/supplierGetAll', brandsGetAll);

//special route
router.post('/v1/uploadexcel', upload.single('file'), UploadExcel);
router.post(
  '/v1/generatecertificate',
  upload.array('files', 2),
  authenticated,
  permissionMiddleware,
  generatecertificate
);

// payment integration
router.post('/payment', payment);
router.get('/success', success);
router.get('/cancel', cancel);
router.post('/v1/refund', refundPayment);

// contact me api for portfolio
router.post('/contactme', contactMe);

// middleware,permissionMiddleware,
module.exports = router;
