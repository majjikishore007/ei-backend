const NotificationLastVisit = require("../models/notification_lastvisit");

exports.insertNotificationLastVisit = async (req, res, next) => {
  try {
    const { date } = req.body;
    let notificationLastVisit = new NotificationLastVisit({
      userId: req.userData.userId,
      lastVisitedAt: date,
    });
    await notificationLastVisit.save();
    res
      .status(200)
      .json({ success: true, message: "notification viewed time saved" });
  } catch (error) {
    if (error.code === 11000) {
      await NotificationLastVisit.update(
        { userId: req.userData.userId },
        { $set: { lastVisitedAt: req.body.date } }
      );

      res
        .status(200)
        .json({ success: true, message: "notification viewed time Updated" });
    } else {
      res.status(500).json({ success: false, error });
    }
  }
};

exports.getLastvisitedNotificationDate = async (req, res, next) => {
  try {
    let notificationLastVisit = await NotificationLastVisit.findOne({
      userId: req.params.id,
    });
    res.status(200).json({ success: true, data: notificationLastVisit });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
