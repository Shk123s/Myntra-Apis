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
} = require('../Controller/myntra');
const router = express.Router();
const { CheckAccess, middleware } = require('../Middleware/checkAccess');

//users routes
router.get('/v1/userGetAll', userGetAll);
router.get('/v1/users/login', userLogin);
router.post('/v1/users/userLoginOtp', userLoginOtp);
router.post('/v1/users/forgetpassword', forgetpassword);
router.post('/v1/users/resetpassword', resetpassword);
router.get('/v1/user/:userid', middleware, CheckAccess, getUser);
router.get('/v1/users', middleware, CheckAccess, getallUser);
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
router.delete('/v1/userpostsdelete/:id', CheckAccess, deleteUserPosts);
//user posts admin approval
router.put('/v1/approvalrequest', CheckAccess, approvedPosts);

//brandsAdd
router.post('/v1/supplierAdd', brandsAdd);
router.get('/v1/supplierGetAll', brandsGetAll);

//special route
router.post('/v1/uploadexcel', upload.single('file'), UploadExcel);
router.post(
  '/v1/generatecertificate',
  upload.array('files', 2),
  middleware,
  CheckAccess,
  generatecertificate
);
// middleware,CheckAccess,
module.exports = router;
