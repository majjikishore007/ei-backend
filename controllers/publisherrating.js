const Publisherrating = require("../models/publisherRating");

exports.getAllPublisherRatings = async (req, res, next) => {
  try {
    let publisherratings = await Publisherrating.find().sort({ _id: -1 });
    res.status(200).json({ success: true, data: publisherratings });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.savePublisherRating = async (req, res, next) => {
  try {
    const publisherrating = new Publisherrating({
      value: req.body.ratingValue,
      publisher: req.body.publisherId,
      user: req.userData.userId,
      date: Date.now(),
    });
    await publisherrating.save();
    res.status(200).json({ success: true, message: "rating successfully" });
  } catch (error) {
    if (error.code === 11000) {
      await Publisherrating.updateOne(
        { publisher: req.body.publisherId, user: req.userData.userId },
        { $set: { value: req.body.ratingValue } }
      );
      res.status(200).json({ success: true, message: "update rating" });
    } else {
      res.status(500).json({ success: false, error });
    }
  }
};

exports.getRatingForPublisherId = async (req, res, next) => {
  try {
    const publisherId = req.params.publisherId;
    const userId = req.userData.userId;
    let rating = await Publisherrating.findOne({
      publisher: publisherId,
      user: userId,
    });
    res.status(200).json({ success: true, data: rating });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
