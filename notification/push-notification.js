const PushNotification = require("../models/push-notification");

exports.sendPushNotification = async (
  admin,
  notification,
  type,
  tokens,
  data
) => {
  let article = false;
  if (
    type == "article-upload" ||
    type == "counter-comment-on-article" ||
    type == "upvote-comment-on-article" ||
    type == "share-article" ||
    type == "rate-article"
  ) {
    article = true;
  }
  let audio = false;
  if (type == "audio-upload") {
    audio = true;
  }
  let video = false;
  if (type == "video-upload") {
    video = true;
  }

  let blog = false;
  if (
    type == "comment-on-blog" ||
    type == "upvote-comment-on-blog" ||
    type == "counter-comment-on-blog"
  ) {
    blog = true;
  }

  let debate = false;
  if (
    type == "debate-upload" ||
    type == "counter-comment-on-debate" ||
    type == "upvote-comment-on-debate"
  ) {
    debate = true;
  }
  let publisher = false;
  if (type == "follow-publisher") {
    publisher = true;
  }

  let custom_notification = false;
  if (type == "custom-notification") {
    custom_notification = true;
  }

  var payload = {
    notification,
    data: {
      click_action: "FLUTTER_NOTIFICATION_CLICK",
      article: article ? (1).toString() : (0).toString(),
      audio: audio ? (1).toString() : (0).toString(),
      video: video ? (1).toString() : (0).toString(),
      blog: blog ? (1).toString() : (0).toString(),
      debate: debate ? (1).toString() : (0).toString(),
      keyword: (0).toString(),
      comment: data.hasOwnProperty("comment") ? data.comment.toString() : "",
      parentComment: data.hasOwnProperty("parentComment")
        ? data.parentComment.toString()
        : "",
      publisher: publisher ? (1).toString() : (0).toString(),
      custom_notification: custom_notification
        ? (1).toString()
        : (0).toString(),
      id: data.id.toString(),
    },
  };
  /**save push notifications */
  let prm = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    let insrt = {
      notification: payload.notification,
      data: payload.data,
      device: tokens[i],
    };
    prm.push(insrt);
  }

  await PushNotification.insertMany(prm);
  admin
    .messaging()
    .sendToDevice(tokens, payload)
    .then((result) => {
      console.log("success");
    })
    .catch((err) => {
      console.log(err);
    });
};
