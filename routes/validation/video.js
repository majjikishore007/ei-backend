exports.validateOnSaveVideo = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // const { title, description, cover, publishingDate } = req.body;
  // if (!title) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Please enter title" });
  // }
  // if (!description) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Please enter description" });
  // }
  // if (!videoStoragePublicUrl) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Please enter video Url" });
  // }
  // if (!category) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Please enter video Categories" });
  // }
  // if (!publishingDate) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Please enter Publishing Date" });
  // }
  next();
};
