const router = require("express").Router();
const authCheck = require("../middleware/check-auth");

/**controller funtions of user */
const {
  getloggedInUserInfo,
  updateUserInfo,
  resetPasswordMail,
  getAllUsers,
  logoutUser,
  getUserCount,
  getUserToken,
  checkEmailExist,
  changePassword,
} = require("../controllers/user");

/**
 * @description   this route is used to get loggedin user info
 * @route   GET      /profile/
 * @access  Private
 */
router.get("/", authCheck, getloggedInUserInfo);

/**
 * @description   this route is used to update loggedin user info
 * @route   PATCH      /profile/
 * @access  Private
 */
router.patch("/", authCheck, updateUserInfo);

/**
 * @description   this route is used to reset password email send
 * @route   POST      /profile/reset
 * @access  Public
 */
router.post("/reset", resetPasswordMail);

/**
 * @description   this route is used to get all users
 * @route   GET      /profile/alluser
 * @access  Public
 */
router.get("/alluser", getAllUsers);

/**
 * @description   this route is used to logout user
 * @route   GET      /profile/logout
 * @access  Private
 */
router.get("/logout", authCheck, logoutUser);

/**
 * @description   this route is used to get count of users
 * @route   GET      /profile/count/user
 * @access  Public
 */
router.get("/count/user", getUserCount);

/**
 * @description   this route is used to get user Token
 * @route   GET      /profile/userTokenData
 * @access  Private
 */
router.get("/userTokenData", authCheck, getUserToken);

/**
 * @description   this route is used to check if given email exist or not
 * @route   GET      /profile/checkMailExisting/:email
 * @access  Public
 */
router.get("/checkMailExisting/:email", checkEmailExist);

/**
 * @description   this route is used to change password
 * @route   PATH      /profile/changePassword
 * @access  Private
 */
router.patch("/changePassword",  changePassword);

module.exports = router;
