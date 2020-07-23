const Usernotification = require("../models/usernotification");

const mongoose = require("mongoose");

exports.getAllUserNotifications = async (req, res, next) => {
  try {
    let result = await Usernotification.find()
      .sort({ _id: -1 })
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("debate")
      .populate("blog")
      .populate("debateParentComment")
      .populate("debateComment")
      .populate("articleParentComment")
      .populate("articleComment")
      .populate("blogParentComment")
      .populate("blogComment");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

/**new functions */
exports.getAllUserNotificationsForUserIdPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    var data = await Usernotification.find({
      reciever: mongoose.Types.ObjectId(req.userData.userId),
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("debate")
      .populate("blog")
      .populate("debateParentComment")
      .populate("debateComment")
      .populate("articleParentComment")
      .populate("articleComment")
      .populate("blogParentComment")
      .populate("blogComment");
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getUnseenUserNotificationsForUserIdPagination = async (
  req,
  res,
  next
) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    var data = await Usernotification.find({
      reciever: mongoose.Types.ObjectId(req.userData.userId),
      viewed: false,
      read: false,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("debate")
      .populate("blog")
      .populate("debateParentComment")
      .populate("debateComment")
      .populate("articleParentComment")
      .populate("articleComment")
      .populate("blogParentComment")
      .populate("blogComment");
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getUnreadUserNotificationsForUserIdPagination = async (
  req,
  res,
  next
) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    var data = await Usernotification.find({
      reciever: mongoose.Types.ObjectId(req.userData.userId),
      read: false,
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("sender")
      .populate("reciever")
      .populate("article")
      .populate("debate")
      .populate("blog")
      .populate("debateParentComment")
      .populate("debateComment")
      .populate("articleParentComment")
      .populate("articleComment")
      .populate("blogParentComment")
      .populate("blogComment");

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

/**new functions */

exports.updateNotificationById = async (req, res, next) => {
  try {
    let data = await Usernotification.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
        reciever: mongoose.Types.ObjectId(req.userData.userId),
      },
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Notification Updated", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
