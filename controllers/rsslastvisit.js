const RssFeedLastVisit = require("../models/rss-lastvisit");

exports.insertRssLastVisit = async (req, res, next) => {
  try {
    const { rssFeedId } = req.body;
    let rssLastVisit = new RssFeedLastVisit({
      userId: req.userData.userId,
      rssFeedId: rssFeedId,
    });
    await rssLastVisit.save();
    res
      .status(200)
      .json({ success: true, message: "last visited Rss Id saved" });
  } catch (error) {
    if (error.code === 11000) {
      await RssFeedLastVisit.update(
        { userId: req.userData.userId },
        { $set: { rssFeedId: req.body.rssFeedId } }
      );

      res.status(200).json({ success: true, message: "last Rss Id Updated" });
    } else {
      res.status(500).json({ success: false, error });
    }
  }
};

exports.getLastvisitedRssFeedId = async (req, res, next) => {
  try {
    let rssFeed = await RssFeedLastVisit.find({ userId: req.params.id });
    res.status(200).json({ success: true, data: rssFeed });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
