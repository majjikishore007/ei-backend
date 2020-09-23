const publisher = require("../../models/publisher");

exports.validateCreatePublisher = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res
        .status(200)
        .json({ success: false, message: "Please enter valid name" });
    }
    if (!req.body.email) {
      return res
        .status(200)
        .json({ success: false, message: "Please enter valid email" });
    }
    if (!req.body.about) {
      return res
        .status(200)
        .json({ success: false, message: "Please enter valid about" });
    }
    if (!req.body.website) {
      return res
        .status(200)
        .json({ success: false, message: "Please enter valid website" });
    }
    if (!req.body.address) {
      return res
        .status(200)
        .json({ success: false, message: "Please enter valid address" });
    }
    let emailExist = await publisher.findOne({ email: req.body.email });
    if (emailExist) {
      return res
        .status(200)
        .json({ success: false, message: "Email already exist" });
    }
    let websiteExist = await publisher.findOne({ website: req.body.website });
    if (websiteExist) {
      return res
        .status(200)
        .json({ success: false, message: "Website already exist" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};
