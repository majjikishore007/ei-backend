const router = require("express").Router();
const pdfs = require("../config/pdf-storage-setup");
const images = require("../config/cloud-storage-setup");

const checkAuthAuthorOrAdmin = require("../middleware/check-auth-authorOrAdmin");

/**
 * requiring controller functions from article controller
 */
const {
  getToptenPdf,
  uploadPdf,
  savePdfPublisher,
  getAllPdfPageWiseLimitWise,
  getPdfById,
  getPdfByTitle,
  editPdfThumbnailByPdfId,
  editPdfById,
  deletePdfById,
  getAllPdfByPublisherId,
  getNoOfPdfForPublisherId,
  getPdfByCategoryFilter,
  getPdfByPublisherIdAndCategory,
  getCountOfTotalPdf,
} = require("../controllers/pdf");

/**
 * @description   this route is used to save pdf by publisher
 * @validation validation fo required fields need to be done in frontend
 * @route   POST      /api/pdf/
 * @access  Private
 */
router.post(
  "/",
  checkAuthAuthorOrAdmin,
  images.multer.single("thumbnail"),
  images.sendUploadToGCS,
  savePdfPublisher
);

/**
 * @description   this route is used to upload an pdf to google cloud by publisher
 * @route   POST      /api/pdf/uploadPdf
 * @access  Private
 */
router.post(
  "/uploadPdf",
  checkAuthAuthorOrAdmin,
  pdfs.sendUploadToGCS,
  uploadPdf
);

/**
 * @description   this route is used to update an pdf by pdfId
 * @route   PATCH      /api/pdf/:pdfId
 * @access  Private
 */
router.patch("/:pdfId", checkAuthAuthorOrAdmin, editPdfById);

/**
 * @description   this route is used to update an pdf by pdfId
 * @route   PATCH      /api/pdf/:pdfId
 * @access  Private
 */
router.patch(
  "/editThumbnail/:pdfId",
  checkAuthAuthorOrAdmin,
  images.multer.single("thumbnail"),
  images.sendUploadToGCS,
  editPdfThumbnailByPdfId
);

/**
 * @description   this route is used to delete an pdf by pdfId
 * @route   DELETE      /api/pdf/:pdfId
 * @access  Private
 */
router.delete("/:pdfId", checkAuthAuthorOrAdmin, deletePdfById);

/**
 * @description   this route is used to get top 10 pdf
 * @route   GET      /api/pdf/topten
 * @access  Public
 */
router.get("/topten", getToptenPdf);

/**
 * @description   this route is used to get an pdf by pdfId
 * @route   POST      /api/pdf/:pdfId
 * @access  Public
 */
router.get("/:pdfId", getPdfById);

/**
 * @description   this route is used to get an pdf by title
 * @route   POST      /api/pdf/pdf/:title
 * @access  Public
 */
router.get("/pdf/:title", getPdfByTitle);

/**
 * @description   this route is used to get number of pdf by publisherId
 * @route   GET      /api/pdf/noOfPdfForPublisher/:publisherId
 * @access  Public
 */
router.get("/noOfPdfForPublisher/:publisherId", getNoOfPdfForPublisherId);

/**
 * @description   this route is used to get list of pdf by category filter
 * @route   GET      /api/pdf/category/:categorySearch
 * @access  Public
 */
router.get("/category/:categorySearch", getPdfByCategoryFilter);

/**
 * @description   this route is used to get list of pdf by with given publisher and given category
 * @route   GET      /api/pdf/publisher/:publisherId/category/:categorySearch
 * @access  Public
 */
router.get(
  "/publisher/:publisherId/category/:categorySearch",
  getPdfByPublisherIdAndCategory
);

/**
 * @description   this route is used to get pdf limitwise and paginationwise
 * @route   GET      /api/pdf/page/:page/limit/:limit
 * @access  Public
 */
router.get("/page/:page/limit/:limit", getAllPdfPageWiseLimitWise);

/**
 * @description   this route is used to get list of pdf paginationwise by publisherId
 * @route   GET      /api/pdf/publisher/:publisherId
 * @access  Public
 */
router.get("/publisher/:publisherId/:page/:limit", getAllPdfByPublisherId);

/**
 * @description   this route is used to get count of  all articles
 * @route   GET      /api/pdf/count/pdf
 * @access  Public
 */
router.get("/count/pdf", getCountOfTotalPdf);

module.exports = router;
