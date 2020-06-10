const router = require("express").Router();
const Publisher = require("../../models/publisher");

exports.validateRssStructure = async (req, res, next) => {
  /**check for required fields presence */
  if (
    !req.body.titleField ||
    !req.body.contentField ||
    !req.body.linkField ||
    !req.body.pubDateField ||
    !req.body.publisherId
  ) {
    return res
      .status(401)
      .json({ success: false, message: "Please fill all required fields" });
  }
  /**check for valid publisherId */
  let publisherExist = await Publisher.findOne({ _id: req.body.publisherId });
  if (!publisherExist) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid publisher Id given" });
  }
  next();
};
