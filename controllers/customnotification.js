const CustomNotification = require("../models/custom_notification");
const {
  ChangeInUserNotification,
} = require("../notification/collection-watch");

const mongoose = require("mongoose");

exports.getAllCustomNotificationsPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let result = await CustomNotification.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("articleList");
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllCustomNotificationsForUserIdPagination = async (
  req,
  res,
  next
) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    var data = await CustomNotification.find({
      $or: [
        { allUser: true },
        { userList: mongoose.Types.ObjectId(req.userData.userId) },
      ],
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("articleList");
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

// exports.getUnseenCustomNotificationForUserIdPagination = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     let page = parseInt(req.params.page);
//     let limit = parseInt(req.params.limit);
//     var data = await CustomNotification.find({
//       $and: [
//         {
//           $or: [
//             { allUser: true },
//             { userList: mongoose.Types.ObjectId(req.userData.userId) },
//           ],
//         },
//         { viewed: false, read: false },
//       ],
//     })
//       .sort({ _id: -1 })
//       .skip(page * limit)
//       .limit(limit)
//       .populate("articleList");
//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error });
//   }
// };

// exports.getUnreadCustomNotificationForUserIdPagination = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     let page = parseInt(req.params.page);
//     let limit = parseInt(req.params.limit);
//     var data = await CustomNotification.find({
//       $and: [
//         {
//           $or: [
//             { allUser: true },
//             { userList: mongoose.Types.ObjectId(req.userData.userId) },
//           ],
//         },
//         { read: false },
//       ],
//     })
//       .sort({ _id: -1 })
//       .skip(page * limit)
//       .limit(limit)
//       .populate("articleList");

//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error });
//   }
// };

exports.getSingleNotification = async (req, res, next) => {
  try {
    let data = await CustomNotification.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      $or: [
        { allUser: true },
        { userList: mongoose.Types.ObjectId(req.userData.userId) },
      ],
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.uploadThumbnail = async (req, res, next) => {
  try {
    if (req.file.cloudStoragePublicUrl) {
      res
        .status(200)
        .json({ success: true, data: req.file.cloudStoragePublicUrl });
    } else {
      res
        .status(200)
        .json({
          success: false,
          message: "Server error while uploading thumbnail",
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    let notification = new CustomNotification({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      category: req.body.category,
      articleList: req.body.articleList,
      allUser: req.body.allUser,
      userList: req.body.userList,
    });

    let newNotification = await notification.save();

    /**push notification to users */

    await ChangeInUserNotification(newNotification, "custom-notification");

    res.status(201).json({
      success: true,
      message: "Notification saved and pushed to users",
      data: newNotification,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.pushExistingNotification = async (req, res, next) => {
  try {
    let notification = await CustomNotification.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });

    /**push notification to users */
    await ChangeInUserNotification(notification, "custom-notification");

    res.status(200).json({
      success: true,
      message: "Notification pushed to users",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateNotificationById = async (req, res, next) => {
  try {
    let data = await CustomNotification.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
        $or: [
          { allUser: true },
          { userList: mongoose.Types.ObjectId(req.userData.userId) },
        ],
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

exports.deleteNotificationById = async (req, res, next) => {
  try {
    await CustomNotification.findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id),
      $or: [
        { allUser: true },
        { userList: mongoose.Types.ObjectId(req.userData.userId) },
      ],
    });
    res.status(200).json({ success: true, message: "Notification Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
