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
const debateRoute = require('./routes/debate-route');
const view = require("./routes/articleview");
const rssFeedRoute = require("./routes/rss-feed-route");
const keywordRoute = require('./routes/keyword-route');
const topicRoute = require('./routes/topic-routes');
const debateArticleRoute = require('./routes/debate-article-route');
const debateCommentRoute = require('./routes/debate-comment-route');
const debateCommentVoteRoute = require('./routes/debate-comment-vote-route');
const debateCounterCommentRoute = require('./routes/debate-counter-commnet-route');
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("nodemailer-express-handlebars");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const compression = require("compression");
const port = process.env.port || 8080;

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
app.use("/api/notification", PublishernotificationRoute);
app.use("/api/usernotification" , UsernotificationRoute)
app.use("/api/bookmark", bookmarkRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/publisherrating", publiherRatingRoutes);
app.use("/api/follow", followRoute);
app.use("/api/blog", blogRoutes);
app.use("/api/cartoon", cartoonRoutes);
app.use("/api/view", pageViewRoute);
app.use("/api/rss", rssFeedRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/preference", preferenceRoute);
app.use("/api/debate", debateRoute)
app.use("/api/debateArticle", debateArticleRoute)
app.use("/api/keyword", keywordRoute);
app.use("/api/topic", topicRoute);
app.use("/api/debateComment", debateCommentRoute)
app.use("/api/debateCommentVote", debateCommentVoteRoute)
app.use("/api/debateCounterComment", debateCounterCommentRoute)
// Provide static directory for  frontend


const Article = require("./models/article");

let sitemap;
app.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  if (sitemap) {
    res.send(sitemap);
    return;
  }
  try {
    const smStream = new SitemapStream({
      hostname: "https://extrainsights.in/",
    });
    const pipeline = smStream.pipe(createGzip());
    smStream.write({ url: "/blogs" });
    smStream.write({ url: "/abouyt-us" });
    smStream.write({ url: "/home" });
    Article.find()
      .sort("-_id")
      .exec()
      .then((result) => {
        for (var i = 0; i < result.length; i++) {
          smStream.write({ url: "/article/frame/" + result[i].urlStr });
        }

        smStream.end();
        // cache the response
        streamToPromise(pipeline).then((sm) => (sitemap = sm));
        // stream the response
        pipeline.pipe(res).on("error", (e) => {
          throw e;
        });
      })
      .catch((err) => {
        res.json(err);
      });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});

//Connect server to Angular index.html file
app.get("*", (req, res) => {
  res.json("invalid");
});
//Start Server: Listen on port 8080
app.listen(port, () => {
  console.log("Listening on port 8080");
});
