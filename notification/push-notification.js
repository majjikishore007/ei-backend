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
      id: data.id.toString(),
    },
  };
  admin
    .messaging()
    .sendToDevice(tokens, payload)
    .then((result) => {
      console.log(result);
      console.log("success");
    })
    .catch((err) => {
      console.log(err);
    });
};
