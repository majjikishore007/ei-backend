const router = require("express").Router();
const checkAuthAdmin = require("../middleware/check-auth-admin");

const {
   saveNewPlaylist,
   editPlaylistDetails,
   deletePlaylist,
   getAllPlaylistData,
   getSinglePlaylistData,
  
} = require("../controllers/plalist");



/**api endpoints for admin management of timeline */

/**
 * @description   this route is used to add new playlist
 * @route   POST      /api/playlist/
 * @access  Private
 */
router.post("/", checkAuthAdmin,  saveNewPlaylist);

/**
 * @description   this route is used to edit playlist info
 * @route   PATCH      /api/playlist/:PlaylistId
 * @access  Private
 */
router.patch("/:PlaylistId", checkAuthAdmin, editPlaylistDetails);



/**
 * @description   this route is used to delete a whole playlist
 * @route   DELETE      /api/playlist/:PlaylistId
 * @access  Private
 */
router.delete("/:PlaylistId", checkAuthAdmin, deletePlaylist);



/**
 * @description   this route is used to get single playlist details
 * @param timelineTopic - timelineTopicId
 * @route   GET      /api/playlist/:PlaylistId
 * @access  public
 */
router.get("/:PlaylistId/:skipvalue/:limit",  getSinglePlaylistData );



/**
 * @description   this route is used to get playlists
 * @param page
 * @param limit
 * @route   GET      /api/playlist/:page/:limit
 * @access  Public
 */
router.get(
  "/:page/:limit",
 
  getAllPlaylistData
);



module.exports = router;