exports.validateOnBlogSave = async (req, res, next) => {
  if (!req.body.title) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter title" });
  }
  if (!req.body.description) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter description" });
  }
  if (!req.file.cloudStoragePublicUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Please select cover image" });
  }
  next();
};
