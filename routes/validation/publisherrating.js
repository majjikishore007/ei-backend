const Publisher = require("../../models/publisher");
const mongoose = require("mongoose");

exports.validateOnSavePublisherRating = async (req, res, next) => {
  try {
    const { ratingValue, publisherId } = req.body;
    if (!ratingValue) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter rating value" });
    }
    if (!publisherId) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter publisher Id" });
    }
    let publisherExist = await Publisher.findOne({
      _id: mongoose.Types.ObjectId(publisherId),
    });
    if (!publisherExist) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter correct publisher" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
