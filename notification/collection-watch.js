const Article = require("../models/article");
const Debate = require("../models/debate");
const Blog = require("../models/blog");
// const Audio = require("../models/audio");
// const Video = require("../models/video");
const User = require("../models/user");
const Publisher = require("../models/publisher");
const Follow = require("../models/follow");
const Preference = require("../models/preference");
const Keyword = require("../models/keyword");
const Subscriber = require("../models/notification_subscriber");
const PublisherNotification = require("../models/publishernotification");

const UserNotification = require("../models/usernotification");
const eventEmitter = require("../notification/event-emitter");

const mongoose = require("mongoose");

/**firebase for push notification */
const admin = require("firebase-admin");
var serviceAccount = require("../extra-insights-app-firebase-adminsdk-ju9cx-4ba57fb78c.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://extra-insights-app.firebaseio.com",
});

/**push notification function */
const { sendPushNotification } = require("../notification/push-notification");

exports.watchChangeInPublisherNotification = async () => {
  try {
    let pipeline = [
      {
        $match: { operationType: "insert" },
      },
    ];
    let changeStreamForComment = PublisherNotification.watch(pipeline);

    changeStreamForComment.on("change", async (event) => {
      if (event.fullDocument) {
        let result = event.fullDocument;
        /**for comment on article */
        if (result.notificationType == "comment-on-article") {
          /**send notificationto publisher about some user commented on his/her article */
          eventEmitter.emit("comment-on-article", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to article publisher*/
          let article = await Article.findOne({ _id: result.article });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: article.title,
              body: result.message,
              image: article.cover,
            };
            let data = {
              id: article._id,
              comment: result.articleComment,
            };
            await sendPushNotification(
              admin,
              notification,
              "comment-on-article",
              results[0].tokens,
              data
            );
          }
        }
        /**for sharing of an article */
        if (result.notificationType == "share-article") {
          eventEmitter.emit("share-article", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to original commentor*/
          let article = await Article.findOne({ _id: result.article });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: article.title,
              body: result.message,
              image: article.cover,
            };
            let data = {
              id: article._id,
            };
            await sendPushNotification(
              admin,
              notification,
              "share-article",
              results[0].tokens,
              data
            );
          }
        }
        /** comment on a debate */
        if (result.notificationType == "comment-on-debate") {
          eventEmitter.emit("comment-on-debate", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to article publisher for comment on debate featured article*/
          let debate = await Debate.findOne({ _id: result.debate });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: debate.title,
              body: result.message,
              image: debate.cover,
            };
            let data = {
              id: debate._id,
              comment: result.debateComment,
            };
            await sendPushNotification(
              admin,
              notification,
              "comment-on-debate",
              results[0].tokens,
              data
            );
          }
        }
        /**follow a publisher */
        if (result.notificationType == "follow-publisher") {
          eventEmitter.emit("follow-publisher", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to publisher to notify someone follow*/
          let publisher = await Publisher.findOne({ _id: result.publisher });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: publisher.name,
              body: result.message,
              image: publisher.logo,
            };
            let data = {
              id: publisher._id,
            };
            await sendPushNotification(
              admin,
              notification,
              "follow-publisher",
              results[0].tokens,
              data
            );
          }
        }
        /**rate a article */
        if (result.notificationType == "rate-article") {
          eventEmitter.emit("rate-article", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to article publisher*/
          let article = await Article.findOne({ _id: result.article });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: article.title,
              body: result.message,
              image: article.cover,
            };
            let data = {
              id: article._id,
            };
            await sendPushNotification(
              admin,
              notification,
              "rate-article",
              results[0].tokens,
              data
            );
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.watchChangeInUserNotification = async () => {
  try {
    let pipeline = [
      {
        $match: { operationType: "insert" },
      },
    ];
    let changeStreamForComment = UserNotification.watch(pipeline);

    changeStreamForComment.on("change", async (event) => {
      if (event.fullDocument) {
        let result = event.fullDocument;

        /**for reply on debate comment */
        if (result.notificationType == "counter-comment-on-debate") {
          /**send notificationto publisher about some user commented on his/her article and
           * user replied to a comment
           */
          eventEmitter.emit("counter-comment-on-debate", {
            reciever: result.reciever,
            data: result,
          });

          /**push notification to original commentor*/
          let debate = await Debate.findOne({ _id: result.debate });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: debate.title,
              body: result.message,
              image: debate.cover,
            };
            let data = {
              id: debate._id,
              parentComment: result.debateParentComment,
              comment: result.debateComment,
            };

            await sendPushNotification(
              admin,
              notification,
              "counter-comment-on-debate",
              results[0].tokens,
              data
            );
          }
        }
        if (result.notificationType == "upvote-comment-on-debate") {
          /**send notification to user
           * someone upvote to a comment
           */
          eventEmitter.emit("upvote-comment-on-debate", {
            reciever: result.reciever,
            data: result,
          });

          /**push notification to original commentor */
          let debate = await Debate.findOne({ _id: result.debate });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);
          if (results.length > 0) {
            let notification = {
              title: debate.title,
              body: result.message,
              image: debate.cover,
            };
            let data = {
              id: debate._id,
              comment: result.debateComment,
            };
            await sendPushNotification(
              admin,
              notification,
              "upvote-comment-on-debate",
              results[0].tokens,
              data
            );
          }
        }

        /**for reply on article comment */
        if (result.notificationType == "counter-comment-on-article") {
          /**send notificationto publisher about some user commented on his/her article and
           * user replied to a comment
           */
          eventEmitter.emit("counter-comment-on-article", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to original commentor*/
          let article = await Article.findOne({ _id: result.article });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: article.title,
              body: result.message,
              image: article.cover,
            };
            let data = {
              id: article._id,
              parentComment: result.articleParentComment,
              comment: result.articleComment,
            };
            await sendPushNotification(
              admin,
              notification,
              "counter-comment-on-article",
              results[0].tokens,
              data
            );
          }
        }
        if (result.notificationType == "upvote-comment-on-article") {
          /**send notification to user
           * someone upvote to a comment
           */
          eventEmitter.emit("upvote-comment-on-article", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to original commentor */
          let article = await Article.findOne({ _id: result.article });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: article.title,
              body: result.message,
              image: article.cover,
            };
            let data = {
              id: article._id,
              comment: result.articleComment,
            };

            await sendPushNotification(
              admin,
              notification,
              "upvote-comment-on-article",
              results[0].tokens,
              data
            );
          }
        }

        /**blog comments */
        if (result.notificationType == "comment-on-blog") {
          /**send notification to user(author(admin))
           * someone comment on blog
           */
          eventEmitter.emit("comment-on-blog", {
            reciever: result.reciever,
            data: result,
          });
          /**push notification to original commentor*/
          let blog = await Blog.findOne({ _id: result.blog });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: blog.title,
              body: result.message,
              image: blog.cover,
            };
            let data = {
              id: blog._id,
              comment: result.blogComment,
            };
            await sendPushNotification(
              admin,
              notification,
              "comment-on-blog",
              results[0].tokens,
              data
            );
          }
        }
        if (result.notificationType == "upvote-comment-on-blog") {
          /**send notification to user
           * someone upvote your comment
           */
          eventEmitter.emit("upvote-comment-on-blog", {
            reciever: result.reciever,
            data: result,
          });

          /**push notification to original commentor */
          let blog = await Blog.findOne({ _id: result.blog });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: blog.title,
              body: result.message,
              image: blog.cover,
            };
            let data = {
              id: blog._id,
              comment: result.blogComment,
            };

            await sendPushNotification(
              admin,
              notification,
              "upvote-comment-on-blog",
              results[0].tokens,
              data
            );
          }
        }
        if (result.notificationType == "counter-comment-on-blog") {
          /**send notification to user
           * someone replied to your comment
           */
          eventEmitter.emit("counter-comment-on-blog", {
            reciever: result.reciever,
            data: result,
          });

          /**push notification to original commentor*/
          let blog = await Blog.findOne({ _id: result.blog });

          let results = await Subscriber.aggregate([
            {
              $match: {
                user: mongoose.Types.ObjectId(result.reciever),
              },
            },
            {
              $group: {
                _id: "user",
                tokens: {
                  $push: "$device",
                },
              },
            },
            {
              $project: {
                _id: 0,
                tokens: 1,
              },
            },
          ]);

          if (results.length > 0) {
            let notification = {
              title: blog.title,
              body: result.message,
              image: blog.cover,
            };
            let data = {
              id: blog._id,
              parentComment: result.blogParentComment,
              comment: result.blogComment,
            };

            await sendPushNotification(
              admin,
              notification,
              "counter-comment-on-blog",
              results[0].tokens,
              data
            );
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.watchNewResourceUploadNotification = async () => {
  try {
    let pipeline = [
      {
        $match: { operationType: "insert" },
      },
    ];

    /**article upload */
    let changeStreamForArticle = Article.watch(pipeline);

    changeStreamForArticle.on("change", async (event) => {
      if (event.fullDocument) {
        /**get followers of uploader publisher */
        let finalUserList = [];

        let followers = await Follow.aggregate([
          {
            $match: {
              publisher: mongoose.Types.ObjectId(event.fullDocument.publisher),
            },
          },
          {
            $group: {
              _id: "$publisher",
              users: {
                $push: "$user",
              },
            },
          },
        ]);
        if (followers.length > 0) {
          finalUserList = followers[0].users;
        }

        let cat = event.fullDocument.category.split(",");
        let cat2 = [];
        for (let i = 0; i < cat.length; i++) {
          cat2.push(cat[i].toLowerCase());
        }

        /**get keyword list and users who prefer those */
        let keywordList = await Keyword.aggregate([
          { $match: { keyword: { $in: cat2 } } },
          {
            $group: {
              _id: "keyword",
              keywordIds: {
                $push: "$_id",
              },
            },
          },
        ]);
        if (keywordList.length > 0) {
          let preferedUsers = await Preference.aggregate([
            { $match: { keyword: { $in: keywordList[0].keywordIds } } },
            {
              $group: {
                _id: "users",
                users: {
                  $push: "$user",
                },
              },
            },
          ]);
          finalUserList = finalUserList.concat(preferedUsers[0].users);
        }

        let results = await Subscriber.aggregate([
          { $match: { user: { $in: finalUserList } } },
          {
            $group: {
              _id: "user",
              tokens: {
                $push: "$device",
              },
            },
          },
          {
            $project: {
              _id: 0,
              tokens: 1,
            },
          },
        ]);
        if (results.length > 0) {
          /**create notification data */
          let notification = {
            title: event.fullDocument.title,
            body: event.fullDocument.description,
            image: event.fullDocument.cover,
          };
          let data = {
            id: event.fullDocument._id,
          };
          await sendPushNotification(
            admin,
            notification,
            "article-upload",
            results[0].tokens,
            data
          );
        }
      }
    });

    /**debate create */
    let changeStreamForDebate = Debate.watch(pipeline);

    changeStreamForDebate.on("change", async (event) => {
      if (event.fullDocument) {
        let results = await Subscriber.aggregate([
          {
            $group: {
              _id: "user",
              tokens: {
                $push: "$device",
              },
            },
          },
          {
            $project: {
              _id: 0,
              tokens: 1,
            },
          },
        ]);
        if (results.length > 0) {
          /**create notification data */
          let notification = {
            title: "New Debate Added",
            body:
              event.fullDocument.title + " - " + event.fullDocument.description,
            image: event.fullDocument.cover,
          };
          let data = {
            id: event.fullDocument._id,
          };
          await sendPushNotification(
            admin,
            notification,
            "debate-upload",
            results[0].tokens,
            data
          );
        }
      }
    });

    // /**audio upload */
    // let changeStreamForAudio = Audio.watch(pipeline);

    // changeStreamForAudio.on("change", async (event) => {
    //   if (event.fullDocument) {
    //     /**get followers of uploader publisher */

    //     let followers = await Follow.aggregate([
    //       {
    //         $match: {
    //           publisher: mongoose.Types.ObjectId(event.fullDocument.publisher),
    //         },
    //       },
    //       {
    //         $group: {
    //           _id: "$publisher",
    //           users: {
    //             $push: "$user",
    //           },
    //         },
    //       },
    //     ]);

    //     if (followers.length < 0) {
    //       return;
    //     }

    //     let results = await Subscriber.aggregate([
    //       { $match: { user: { $in: followers[0].users } } },
    //       {
    //         $group: {
    //           _id: "user",
    //           tokens: {
    //             $push: "$device",
    //           },
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           tokens: 1,
    //         },
    //       },
    //     ]);
    //     if (results.length < 0) {
    //       return;
    //     }

    //     /**create notification data */
    //     let notification = {
    //       title: event.fullDocument.title,
    //       body: event.fullDocument.description,
    //       image: event.fullDocument.cover,
    //     };
    //     await sendPushNotification(
    //       notification,
    //       "audio-upload",
    //       results[0].tokens,
    //       event.fullDocument._id
    //     );
    //   }
    // });

    // /**video upload */

    // let changeStreamForVideo = Video.watch(pipeline);

    // changeStreamForVideo.on("change", async (event) => {
    //   if (event.fullDocument) {
    //     /**get followers of uploader publisher */

    //     let followers = await Follow.aggregate([
    //       {
    //         $match: {
    //           publisher: mongoose.Types.ObjectId(event.fullDocument.publisher),
    //         },
    //       },
    //       {
    //         $group: {
    //           _id: "$publisher",
    //           users: {
    //             $push: "$user",
    //           },
    //         },
    //       },
    //     ]);

    //     if (followers.length < 0) {
    //       return;
    //     }

    //     let results = await Subscriber.aggregate([
    //       { $match: { user: { $in: followers[0].users } } },
    //       {
    //         $group: {
    //           _id: "user",
    //           tokens: {
    //             $push: "$device",
    //           },
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           tokens: 1,
    //         },
    //       },
    //     ]);
    //     if (results.length < 0) {
    //       return;
    //     }

    //     /**create notification data */
    //     let notification = {
    //       title: event.fullDocument.title,
    //       body: event.fullDocument.description,
    //       image: event.fullDocument.cover,
    //     };
    //     await sendPushNotification(
    //       notification,
    //       "video-upload",
    //       results[0].tokens,
    //       event.fullDocument._id
    //     );
    //   }
    // });
  } catch (error) {
    console.log(error);
  }
};
