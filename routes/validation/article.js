exports.validateOnUploadArticle = async (req, res, next) => {
  const { title, description, cover, publishingDate } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter title" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter description" });
  }
  if (!cover) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter cover" });
  }
  if (!publishingDate) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter Publishing Date" });
  }
  next();
};
