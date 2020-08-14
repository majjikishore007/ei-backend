const Article = require("../models/article");
const Publisher = require("../models/publisher");
const Rating = require("../models/rating");
const Comment = require("../models/comment");
const Viewarticle = require("../models/articleview");
const Usernotification = require("../models/usernotification");
const Follow = require("../models/follow");

const mongoose = require("mongoose");

exports.getInitialArticles = async (req, res, next) => {
  try {
    let limitCount = +req.params.limitCount || 20;
    let docs = await Article.find({
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .limit(limitCount)
      .populate("publisher");

    if (docs.length > 0) {
      let restructuredResult = docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          price: doc.price,
          author: doc.author,
          cover: doc.cover,
          publisher: doc.publisher,
          website: doc.website,
          category: doc.category,
          time: doc.time,
          date: doc.publishingDate,
          id: doc._id,
          lan: doc.lan,
          urlStr: doc.urlStr,
          public: doc.public,
          altImage: doc.altImage,
          seo: doc.seo,
          publisherId: doc.publisher ? doc.publisher._id : null,
        };
      });
      res.status(200).json({
        success: true,
        count: restructuredResult.length,
        data: restructuredResult,
      });
    } else {
      res.status(404).json({ success: false, message: "No entries found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNextArticles = async (req, res, next) => {
  try {
    let lastArticleId = mongoose.Types.ObjectId(req.params.lastArticleId);
    let limitCount = +req.params.limitCount || 20;
    let docs = await Article.find({
      _id: { $lt: lastArticleId },
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .limit(limitCount)
      .populate("publisher");

    if (docs.length > 0) {
      let restructuredResult = docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          price: doc.price,
          author: doc.author,
          cover: doc.cover,
          publisher: doc.publisher,
          website: doc.website,
          category: doc.category,
          time: doc.time,
          date: doc.publishingDate,
          id: doc._id,
          lan: doc.lan,
          urlStr: doc.urlStr,
          public: doc.public,
          altImage: doc.altImage,
          seo: doc.seo,
          publisherId: doc.publisher ? doc.publisher._id : null,
        };
      });
      res.status(200).json({
        success: true,
        count: restructuredResult.length,
        data: restructuredResult,
      });
    } else {
      res.status(404).json({ success: false, message: "No entries found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getToptenArticles = async (req, res, next) => {
  try {
    let docs = await Article.find({
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .limit(10)
      .populate("publisher");

    if (docs.length > 0) {
      let restructuredResult = docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          price: doc.price,
          author: doc.author,
          cover: doc.cover,
          publisher: doc.publisher,
          website: doc.website,
          category: doc.category,
          time: doc.time,
          date: doc.publishingDate,
          id: doc._id,
          lan: doc.lan,
          urlStr: doc.urlStr,
          public: doc.public,
          altImage: doc.altImage,
          seo: doc.seo,
          publisherId: doc.publisher ? doc.publisher._id : null,
        };
      });
      res.status(200).json({
        success: true,
        count: restructuredResult.length,
        data: restructuredResult,
      });
    } else {
      res.status(404).json({ success: false, message: "No entries found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesForMobile = async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit);
    const page = parseInt(req.params.num);
    Article.find({ $or: [{ device: "both" }, { device: req.params.device }] })
      .populate("publisher")
      .sort("-_id")
      .skip(limit * page)
      .limit(limit)
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          artciles: docs.map((doc) => {
            return {
              title: doc.title,
              description: doc.description,
              price: doc.price,
              author: doc.author,
              cover: doc.cover,
              publisher: doc.publisher,
              website: doc.website,
              category: doc.category,
              time: doc.time,
              date: doc.publishingDate,
              id: doc.id,
              lan: doc.lan,
              urlStr: doc.urlStr,
              altImage: doc.altImage,
              seo: doc.seo,
            };
          }),
        };
        if (docs.length >= 0) {
          res.json({ success: true, articles: response.artciles });
        } else {
          res.json({ success: false, code: 404, message: "No entries found" });
        }
      });
  } catch (error) {
    res.json({ success: false, error: err });
  }
};

exports.uploadArticleAdmin = async (req, res, next) => {
  try {
    const article = new Article({
      title: req.body.title,
      description: req.body.description,
      cover: req.body.cover,
      price: req.body.price,
      author: req.body.author,
      publisher: req.body.publisher,
      time: req.body.time,
      website: req.body.website,
      category: req.body.category,
      content: req.body.content,
      publishingDate: req.body.publishingDate,
      created_at: Date.now(),
      altImage: req.body.altImage ? req.body.altImage : req.body.title,
      seo: {
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        metaKeywords: req.body.metaKeywords,
      },
      urlStr: req.body.title
        .trim()
        .replace(/[&\/\\#, +()$~%.'":;*?<>{}]+/gi, "-"),
      public: true,
      device: req.body.device,
    });
    await article.save();
    res.status(201).json({
      success: true,
      message: "article has been submitted",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editArticleCoverAdmin = async (req, res, next) => {
  try {
    const id = req.params.articleId;
    data = {
      cover: req.file.cloudStoragePublicUrl,
    };
    await Article.findByIdAndUpdate(id, { $set: data });
    res.status(200).json({
      success: true,
      message: "Image updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.uploadArticlePublisher = async (req, res, next) => {
  try {
    const article = new Article({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      publisher: req.body.publisher,
      price: req.body.price,
      time: req.body.time,
      seo: {
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        metaKeywords: req.body.metaKeywords,
      },
      altImage: req.body.altImage ? req.body.altImage : req.body.title,
      publishingDate: req.body.publishingDate,
      created_at: Date.now(),
      lan: req.body.lan,
      urlStr: req.body.title
        .trim()
        .replace(/[&\/\\#=, +()$~%.'":;*?<>{}]+/gi, "-"),
      device: req.body.device,
    });
    await article.save();
    res
      .status(201)
      .json({ success: true, message: "article has been submitted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editArticleCover = async (req, res, next) => {
  try {
    const id = req.params.articleId;
    data = {
      cover: req.file.cloudStoragePublicUrl,
    };
    await Article.findByIdAndUpdate(id, { $set: data });
    res.status(200).json({
      success: true,
      message: "Image updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const id = req.params.articleId;
    let doc = await Article.findById(id).populate("publisher");
    if (doc) {
      let article = {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
      res.status(200).json({ success: true, data: article });
    } else {
      res.status(404).json({ success: false, message: "No valid entry" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticleByIdForMobile = async (req, res, next) => {
  try {
    let doc = await Article.findOne({
      _id: mongoose.Types.ObjectId(req.params.articleId),
    });
    if (doc) {
      let article = {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
      res.status(200).json({ success: true, data: article });
    } else {
      res.status(404).json({ success: false, message: "No valid entry" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticleByTitle = async (req, res, next) => {
  try {
    const urlStr = req.params.title;
    let doc = await Article.findOne({ urlStr: urlStr }).populate("publisher");
    if (!doc) {
      return res
        .status(400)
        .json({ success: false, message: "Article not Found" });
    }
    const owner =
      doc.publisher &&
      doc.publisher.userId &&
      doc.publisher.userId == "5e5378b728d7f105839325b5"
        ? true
        : false;
    let article = {
      title: doc.title,
      description: doc.description,
      price: doc.price,
      author: doc.author,
      cover: doc.cover,
      publisher: doc.publisher,
      website: doc.website,
      category: doc.category,
      time: doc.time,
      date: doc.publishingDate,
      id: doc._id,
      lan: doc.lan,
      urlStr: doc.urlStr,
      public: doc.public,
      altImage: doc.altImage,
      seo: doc.seo,
      publisherId: doc.publisher ? doc.publisher._id : null,
    };
    res.status(200).json({ success: true, data: article, owner });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editArticleById = async (req, res, next) => {
  try {
    const id = req.params.articleId;
    await Article.update({ _id: id }, { $set: req.body }, { $new: true });
    res.status(200).json({ success: true, message: "Article Updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteArticleById = async (req, res, next) => {
  try {
    const id = req.params.articleId;
    await Article.remove({ _id: id });
    res.json({ success: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    let docs = await Article.find({
      publisher: id,
      $or: [{ device: "both" }, { device: req.params.device }],
    }).populate("publisher");
    if (docs.length > 0) {
      let restructuredResult = docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          price: doc.price,
          author: doc.author,
          cover: doc.cover,
          publisher: doc.publisher,
          website: doc.website,
          category: doc.category,
          time: doc.time,
          date: doc.publishingDate,
          id: doc._id,
          lan: doc.lan,
          urlStr: doc.urlStr,
          public: doc.public,
          altImage: doc.altImage,
          seo: doc.seo,
          publisherId: doc.publisher ? doc.publisher._id : null,
        };
      });

      res.status(200).json({
        success: true,
        count: restructuredResult.length,
        data: restructuredResult,
      });
    } else {
      res.status(400).json({ success: false, message: "Articles not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByPublisherIdPagination = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let docs = await Article.find({
      publisher: id,
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");
    if (docs.length > 0) {
      let restructuredResult = docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          price: doc.price,
          author: doc.author,
          cover: doc.cover,
          publisher: doc.publisher,
          website: doc.website,
          category: doc.category,
          time: doc.time,
          date: doc.publishingDate,
          id: doc._id,
          lan: doc.lan,
          urlStr: doc.urlStr,
          public: doc.public,
          altImage: doc.altImage,
          seo: doc.seo,
          publisherId: doc.publisher ? doc.publisher._id : null,
        };
      });

      res.status(200).json({
        success: true,
        count: restructuredResult.length,
        data: restructuredResult,
      });
    } else {
      res.status(400).json({ success: false, message: "Articles not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNoOfArticleForPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    let articles = await Article.find({
      publisher: id,
      $or: [{ device: "both" }, { device: req.params.device }],
    });
    res.json({ success: true, count: articles.length });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByCategoryFilter = async (req, res, next) => {
  try {
    const cat = req.params.categorySearch;
    let articles = await Article.find({
      category: new RegExp(cat, "i"),
      public: true,
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .limit(5)
      .populate("publisher");

    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });

    res.status(200).json({ success: true, data: restructuredResult });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
exports.getArticlesByCategoryFilterPagination = async (req, res, next) => {
  try {
    const cat = req.params.categorySearch;
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let articles = await Article.find({
      category: new RegExp(cat, "i"),
      public: true,
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");

    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });

    res.status(200).json({ success: true, data: restructuredResult });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByCategoryTotal = async (req, res, next) => {
  try {
    const cat = req.params.category;
    let articles = await Article.find({
      category: new RegExp(cat, "i"),
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .populate("publisher");
    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });
    res.status(200).json({ success: true, data: restructuredResult });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByCategoryTotalPagination = async (req, res, next) => {
  try {
    const cat = req.params.category;
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let articles = await Article.find({
      category: new RegExp(cat, "i"),
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");
    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });
    res.status(200).json({ success: true, data: restructuredResult });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByPublisherIdAndCategory = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    const cat = req.params.categorySearch;
    let articles = await Article.find({
      $and: [
        {
          publisher: id,
          category: new RegExp(cat, "i"),
          $or: [{ device: "both" }, { device: req.params.device }],
        },
      ],
    }).populate("publisher");
    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });
    res.status(200).json({
      success: true,
      count: articles.length,
      data: restructuredResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByPublisherIdAndCategoryPagination = async (
  req,
  res,
  next
) => {
  try {
    const id = req.params.publisherId;
    const cat = req.params.categorySearch;
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let articles = await Article.find({
      $and: [
        {
          publisher: id,
          category: new RegExp(cat, "i"),
          $or: [{ device: "both" }, { device: req.params.device }],
        },
      ],
    })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");
    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });
    res.status(200).json({
      success: true,
      count: articles.length,
      data: restructuredResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByPublisherIdAndCategoryForMobile = async (
  req,
  res,
  next
) => {
  try {
    const id = req.params.publisherId;
    const cat = req.params.categorySearch;
    let articles = await Article.find({
      $and: [
        {
          publisher: id,
          category: new RegExp(cat, "i"),
          $or: [{ device: "both" }, { device: req.params.device }],
        },
      ],
    }).populate("publisher");
    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });
    res.status(200).json({
      success: true,
      count: articles.length,
      data: restructuredResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesByPublisherIdAndCategoryForMobilePagination = async (
  req,
  res,
  next
) => {
  try {
    const id = req.params.publisherId;
    const cat = req.params.categorySearch;
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let articles = await Article.find({
      $and: [
        {
          publisher: id,
          category: new RegExp(cat, "i"),
          $or: [{ device: "both" }, { device: req.params.device }],
        },
      ],
    })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");
    let restructuredResult = articles.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        author: doc.author,
        cover: doc.cover,
        publisher: doc.publisher,
        website: doc.website,
        category: doc.category,
        time: doc.time,
        date: doc.publishingDate,
        id: doc._id,
        lan: doc.lan,
        urlStr: doc.urlStr,
        public: doc.public,
        altImage: doc.altImage,
        seo: doc.seo,
        publisherId: doc.publisher ? doc.publisher._id : null,
      };
    });
    res.status(200).json({
      success: true,
      count: articles.length,
      data: restructuredResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesWithCommentsAndRatings = async (req, res, next) => {
  try {
    /******************** 1st step */
    let publishers = await Publisher.find(
      { userId: req.params.userId },
      { name: 1 }
    );

    /******************* 2nd step is dependent on step 1*/
    const articleByuser = [];
    let prArr = [];
    for (x of publishers) {
      let prm = Article.find({
        publisher: x._id,
        $or: [{ device: "both" }, { device: req.params.device }],
      })
        .sort("-_id")
        .select("title publisher urlStr");
      prArr.push(prm);
    }

    let response = await Promise.all(prArr);

    for (let i = 0; i < publishers.length; i++) {
      const data = {
        pubname: publishers[i].name,
        articles: response[i],
      };
      articleByuser.push(data);
    }

    /************** */
    const articefullDetails = [];
    let commentPromiseArr = [];
    let ratingPromiseArr = [];
    let viewPromiseArr = [];

    for (x of articleByuser) {
      for (y of x.articles) {
        let commentPromise = Comment.find({ article: y._id });
        let ratingPromise = Rating.find({ article: y._id });
        let viewPromise = Viewarticle.find({ news: y._id })
          .sort("-_id")
          .populate("user", "displayName");
        commentPromiseArr.push(commentPromise);
        ratingPromiseArr.push(ratingPromise);
        viewPromiseArr.push(viewPromise);
      }
    }

    let commentResponse = await Promise.all(commentPromiseArr);
    let ratingResponse = await Promise.all(ratingPromiseArr);
    let viewResponse = await Promise.all(viewPromiseArr);

    for (x of articleByuser) {
      for (let i = 0; i < x.articles.length; i++) {
        let data = {
          article: x.articles[i],
          comments: commentResponse[i],
          ratings: ratingResponse[i],
          views: viewResponse[i],
        };
        articefullDetails.push(data);
      }
    }

    res.status(200).json({ success: true, data: articefullDetails });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCountOfTotalArticles = async (req, res, next) => {
  try {
    let articleCount = await Article.countDocuments({
      $or: [{ device: "both" }, { device: req.params.device }],
    });
    res.status(200).json({ success: true, count: articleCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
