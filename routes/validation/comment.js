exports.validateOnCommentSave = async (req, res, next) => {
  if (!req.body.message) {
    return res
      .status(400)
      .json({ success: false, message: "Please enetr message" });
  }
  next();
};
