const router = require("express").Router();
const images = require("../config/cloud-storage-setup");
const checkAuthAdmin = require("../middleware/check-auth-admin");

/**controller functions for blog */
const {
  getAllBlogPosts,
  getBlogsFilteredByCategory,
  getBlogById,
  getBlogByTitle,
  saveBlog,
  updateBlogById,
  deleteBlogById,
  getNextBatchBlogs,
} = require("../controllers/blog");

/**validation function */
const { validateOnBlogSave } = require("./validation/blog");

/**
 * @description   this route is used to get blog posts filtered with category
 * @param paramp - category of blog post
 * @route   GET      /api/blog/category/:paramp
 * @access  Public
 */
router.get("/category/:paramp", getBlogsFilteredByCategory);

/**
 * @description   this route is used to get single blog post with Id
 * @param id - blogId
 * @route   GET      /api/blog/:id
 * @access  Public
 */
router.get("/:id", getBlogById);

/**
 * @description   this route is used to blog post filtered with title
 * @param title - urlStr of blog post
 * @route   GET      /api/blog/blog/:title
 * @access  Public
 */
router.get("/blog/:title", getBlogByTitle);

/**
 * @description   this route is used to add a new blog post by admin
 * @route   POST      /api/blog/
 * @access  Private
 */
router.post(
  "/",
  checkAuthAdmin,
  images.multer.single("cover"),
  images.sendUploadToGCS,
  validateOnBlogSave,
  saveBlog
);

/**
 * @description   this route is used to edit a blog post with Id
 * @param id - blogId
 * @route   PATCH      /api/blog/:id
 * @access  Private
 */
router.patch("/:id", checkAuthAdmin, updateBlogById);

/**
 * @description   this route is used to delete blog post with Id
 * @param id - blogId
 * @route   DELETE      /api/blog/:id
 * @access  Private
 */
router.delete("/:id", checkAuthAdmin, deleteBlogById);

/**
 * @description   this route is used to get limited blog posts
 * @route   GET      /api/blog/:limitCount
 * @access  Public
 */
router.get("/getInitials/:limitCount", getAllBlogPosts);

/**
 * @description   this route is used to get next batch limited blog posts
 * @param lastBlogId - last fetched blogId after next blogs need to fetch
 * @route   GET      /api/blog/nextbatch/:limitCount/:lastBlogId
 * @access  Public
 */
router.get("/nextbatch/:limitCount/:lastBlogId", getNextBatchBlogs);

module.exports = router;
