const Publisher = require("../../models/publisher");
const mongoose = require("mongoose");

exports.validateOnCreditSave = async (req, res, next) => {
  try {
    if (!req.body.credit) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter credit" });
    }
    if (!req.body.publisher) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter publisher" });
    }
    let publisherExist = await Publisher.findOne({
      _id: mongoose.Types.ObjectId(req.body.publisher),
    });
    if (!publisherExist) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter correct publisher" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
