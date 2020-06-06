const router = require("express").Router();
const Article = require("../models/article");
const Comment = require("../models/comment");
const Publishernotification = require("../models/publishernotification");
const checkAuth = require("../middleware/check-auth");
router.get("/", (req, res) => {
  Comment.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        comments: docs.map((doc) => {
          return {
            message: doc.message,
            user: doc.user,
            article: doc.article,
            id: doc.id,
            date: doc.date,
          };
        }),
      };
      if (docs.length >= 0) {
        res.json(response);
      } else {
        res.json({ success: false, code: 404, message: "No entries found" });
      }
    });
});
router.post("/", checkAuth, async (req, res) => {
  try {
    await Article.findOne({ urlStr: req.body.articleId })
      .exec()
      .then(async (result) => {
        if (result) {
          const comment = new Comment({
            message: req.body.message,
            user: req.userData.userId,
            article: result._id,
            date: Date.now(),
          });

          const publishernotification = new Publishernotification({
            message: req.body.message,
            sender: req.userData.userId,
            reciever: result.publisher,
            article: result._id,
            date: Date.now(),
          });

          await comment
            .save()
            .then((result) => {
              res.json({ success: true, message: "Comment added" });
            })

            .catch((err) => {
              res.json({ success: false, error: err });
            });

          await publishernotification
            .save()
            .then((result) => {
              res.json({
                success: true,
                message: "Comment added to notification",
              });
            })

            .catch((err) => {
              res.json({ success: false, error: err });
            });
        }
      });
  } catch (err) {
    // Handle error here
  }
});
router.get("/:articleId", (req, res) => {
  const articleId = req.params.articleId;
  Article.findOne({ urlStr: articleId })
    .exec()
    .then((result) => {
      Comment.find({ article: result._id })
        .sort("-_id")
        .populate("user", "displayName thumbnail")
        .exec()
        .then((result) => {
          res.json({ success: true, comments: result });
        })
        .catch((err) => {
          res.json({ success: false, error: err.name });
        });
    });
});










router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  Comment.find({ user: userId })
    .populate("Article")
    .exec()
    .then((result) => {
      res.json({ success: true, comments: result });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

router.patch("/:id", (req, res) => {});

router.delete("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  Comment.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.json({ success: true, message: "message has been deleted" });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

router.get("/aggregate/all", (req, res) => {
  Comment.aggregate([
    {
      $group: {
        _id: "$article",
        total: { $sum: 1 },
      },
    },
  ])
    .exec()
    .then((result) => {
      comments = {};
      for (var i = 0; i < result.length; i++) {
        comments[result[i]._id] = result[i].total;
      }
      res.json(comments);
    });
});
/*
router.get("/article/:id", (req, res) => {
  const articleId = req.params.id;

  Comment.countDocuments({ article: articleId })
    .exec()
    .then((count) => {
      res.json({ success: true, count: count });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});
*/
router.get("/article/:articleId", (req, res) => {

  Comment.find({ article: req.params.articleId })
    .sort("-_id")
    
    .exec()
    .then((result) => {
      res.json({ success: true, comments: result });
    })
    .catch((err) => {
      res.json({ success: false, error: err.name });
    });

});
module.exports = router;
