exports.validateNominatePublisher = async (req, res, next) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter valid publisher name" });
  }
  next();
};
