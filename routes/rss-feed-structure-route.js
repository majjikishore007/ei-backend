const router = require("express").Router();
const RssFeedStructure = require("../models/rss-feed-structure");

/**validation files */
const { validateRssStructure } = require("./validation/validateRssStructure");

/**
 * @desc    GET all Rss feed structure list
 * @route   Get /api/rssfeedstructure
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    let docs = await RssFeedStructure.find();
    if (docs.length >= 0) {
      res.status(200).json({
        success: true,
        count: docs.length,
        rssFeedStructures: docs,
      });
    } else {
      res.status(404).json({ success: false, message: "No entries found" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc    GET Single rss feed structure with its id
 * @route   Get /api/rssfeedstructure/:id
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    let doc = await RssFeedStructure.findOne({ _id: req.params.id });
    if (doc) {
      res.status(200).json({ success: true, rssFeedStructure: doc });
    } else {
      res.status(404).json({ success: false, message: "No Entry Found" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc   GET single rss feed structure for a particular publisher with publisherId
 * @route  Get /api/rssfeedstructure/publisher/:publisherId
 * @access Public
 */
router.get("/publisher/:publisherId", async (req, res) => {
  try {
    let doc = await RssFeedStructure.findOne({
      publisherId: req.params.publisherId,
    });
    if (doc) {
      res.status(200).json({ success: true, rssFeedStructure: doc });
    } else {
      res.status(404).json({ success: false, message: "No Entry Found" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc POST inserting a specific format of rss feed for a specific publisherId
 * @route Post /api/rssfeedstructure
 * @access Private
 */
/**access should be private */

router.post("/", validateRssStructure, async function (req, res) {
  try {
    const {
      titleField,
      contentField,
      linkField,
      pubDateField,
      publisherId,
    } = req.body;

    let structure = {
      titleField,
      contentField,
      linkField,
      pubDateField,
      publisherId,
    };
    if (req.body.authorField) {
      structure.authorField = req.body.authorField;
    }
    if (req.body.imageField) {
      structure.imageField = req.body.imageField;
    }
    let insertedStructure = await new RssFeedStructure(structure).save();
    res.status(201).json({
      success: true,
      message: "Rss feed inserted!",
      rssFeedStructure: insertedStructure,
    });
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc    PATCH updating rss structure for a specific id
 * @route   Patch /api/rssfeedstructure/:id   (using patch instead of put because don't want to mention every field while updating)
 * @access Private
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let updatedStructure = await RssFeedStructure.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Rss structure updated!",
      rssFeedStructure: updatedStructure,
    });
  } catch (err) {
    res.json({ error: err });
  }
});

/**
 * @desc   DELETE delete a rss structure with its Id
 * @route  Delete  /api/rssfeedstructure/:id
 * @access Private
 */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await RssFeedStructure.remove({ _id: id });
    res.status(200).json({ success: true, message: "Rss structure deleted!" });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;
