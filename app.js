const express = require("express");
const app = express();
const passport = require("passport");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const config = require("./config/database");
const passportSetup = require("./config/passport-setup");
const path = require("path");
const authentication = require("./routes/authentication"); // Import Authentication Routes
const socialMediaLogin = require("./routes/social-media-login");
const userPage = require("./routes/user-route");
const articleRoute = require("./routes/article-route");
const articletopRoute = require("./routes/articletop-route");
const publisherRoute = require("./routes/publisher-routes");
const paymentRoute = require("./routes/payment-route");
const creditRoutes = require("./routes/credits-routes");
const commentRoute = require("./routes/comment-route");
const PublishernotificationRoute = require("./routes/publishernotification-route");
const UsernotificationRoute = require("./routes/usernotification-route");
const bookmarkRoute = require("./routes/bookmark-route");
const ratingRoute = require("./routes/rating-routes");
const publiherRatingRoutes = require("./routes/publisher-rating-route");
const followRoute = require("./routes/follow-route");
const blogRoutes = require("./routes/blog-route");
const cartoonRoutes = require("./routes/cartoon-route");
const pageViewRoute = require("./routes/view-route");
const feedbackRoute = require("./routes/feedback-route");
const preferenceRoute = require("./routes/preference-route");
const debateRoute = require("./routes/debate-route");
const view = require("./routes/articleview");
const rssFeedRoute = require("./routes/rss-feed-route");
const rssFeedStructureRoute = require("./routes/rss-feed-structure-route");
const rssLastVisitRoute = require("./routes/rsslastvisit-route");
const rssArchiveRoute = require("./routes/rssarchive-route");
const keywordRoute = require("./routes/keyword-route");
const topicRoute = require("./routes/topic-routes");
const debateArticleRoute = require("./routes/debate-article-route");
const debateCommentRoute = require("./routes/debate-comment-route");
const debateCommentVoteRoute = require("./routes/debate-comment-vote-route");

const busboy = require("connect-busboy");
const articleCommentVoteRoute = require("./routes/article-comment-vote-route");
const articleCounterCommentRoute = require("./routes/article-counter-comment-route");

const blogCommentRoute = require("./routes/blog-comment-route");
const blogCommentVoteRoute = require("./routes/blog-comment-vote-route");
const blogCounterCommentRoute = require("./routes/blog-counter-comment-route");

const cron = require("node-cron");
const { insertRssIntoAllContent } = require("./controllers/rssfeed");

const debateCounterCommentRoute = require("./routes/debate-counter-comment-route");
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("nodemailer-express-handlebars");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const compression = require("compression");
const port = process.env.port || 8080;
const newsFeed = require("./routes/newsfeed");
const nominatePublisher = require("./routes/nominatepublisher-route");
const newsletterSubscriber = require("./routes/newslettersubscriber-route");
const likeRoute = require("./routes/like-route");
const videoRoute = require("./routes/video");
const videoViewRoute = require("./routes/videoview-route");
const videoBookmarkRoute = require("./routes/videobookmark");
const videoTopRoute = require("./routes/videotop");
const audioRoute = require("./routes/audio");
const pdfRoute = require("./routes/pdf");
const subscribeNotification = require("./routes/subscribe-notification-route");
const notificationLastVisit = require("./routes/notificationlastvisit-route");
const landingRoute = require("./routes/landing");
const searchRoute = require("./routes/search");
const recomendationRoute = require("./routes/recomendation-route");
const PushnotificationRoute = require("./routes/push-notification");

mongoose.Promise = global.Promise;
mongoose.connect(
  config.uri,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    reconnectTries: 30,
    reconnectInterval: 500,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log("connection lost" + err);
    } else {
      console.log("DB is connected");
    }
  }
);

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(
  busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
  })
);

// Middleware
// express-session must be used before passport

app.use("/authentication", authentication);
app.use("/social", socialMediaLogin);
app.use("/profile", userPage);
app.use("/api/article", articleRoute);
app.use("/api/articletop", articletopRoute);
app.use("/api/view", view);
app.use("/api/publisher", publisherRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/credit", creditRoutes);
app.use("/api/comment", commentRoute);
app.use("/api/publishernotification", PublishernotificationRoute);
app.use("/api/pushnotification", PushnotificationRoute);
app.use("/api/usernotification", UsernotificationRoute);
app.use("/api/bookmark", bookmarkRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/publisherrating", publiherRatingRoutes);
app.use("/api/follow", followRoute);
app.use("/api/blog", blogRoutes);
app.use("/api/cartoon", cartoonRoutes);
app.use("/api/view", pageViewRoute);
app.use("/api/rss", rssFeedRoute);
app.use("/api/rssfeedstructure", rssFeedStructureRoute);
app.use("/api/rsslastvisit", rssLastVisitRoute);
app.use("/api/rssarchive", rssArchiveRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/preference", preferenceRoute);
app.use("/api/debate", debateRoute);
app.use("/api/debateArticle", debateArticleRoute);
app.use("/api/keyword", keywordRoute);
app.use("/api/topic", topicRoute);
app.use("/api/debateComment", debateCommentRoute);
app.use("/api/debateCommentVote", debateCommentVoteRoute);
app.use("/api/debateCounterComment", debateCounterCommentRoute);

app.use("/api/articleCommentVote", articleCommentVoteRoute);
app.use("/api/articleCounterComment", articleCounterCommentRoute);
app.use("/api/blogComment", blogCommentRoute);
app.use("/api/blogCommentVote", blogCommentVoteRoute);
app.use("/api/blogCounterComment", blogCounterCommentRoute);
app.use("/api/newsfeed", newsFeed);
app.use("/api/nominatepublisher", nominatePublisher);
app.use("/api/newslettersubscribe", newsletterSubscriber);
app.use("/api/like", likeRoute);
app.use("/api/video", videoRoute);
app.use("/api/videoview", videoViewRoute);
app.use("/api/videobookmark", videoBookmarkRoute);
app.use("/api/videotop", videoTopRoute);
app.use("/api/audio", audioRoute);
app.use("/api/pdf", pdfRoute);
// Provide static directory for  frontend
app.use("/api/subscribeNotification", subscribeNotification);
app.use("/api/notificationlastvisit", notificationLastVisit);
app.use("/api/landing", landingRoute);
app.use("/api/search", searchRoute);
app.use("/api/recomendation", recomendationRoute);

//Connect server to Angular index.html file
app.get("*", (req, res) => {
  res.json("invalid");
});

/**declare scheduler to execute every 2 minute */
cron.schedule("*/2 * * * *", () => {
  insertRssIntoAllContent();
});

/**declare scheduler to execute every 3 hours */
cron.schedule("0 0 */3 * * *", () => {
  require("./util/newsfeed").saveNewsfeedForMobile();
  require("./util/newsfeed").saveNewsfeedForWebsite();
});

//Start Server: Listen on port 8080
let server = app.listen(port, () => {
  console.log("Listening on port 8080");
});

const socket = require("./notification/socket")(server);

module.exports = socket;
