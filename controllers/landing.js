const Article = require("../models/article");

exports.getArticlesByCategoryGiven = async (req, res, next) => {
  try {
    let articles = await Article.find({
      category: new RegExp(req.params.categorySearch, "i"),
      public: true,
    })
      .sort({ _id: -1 })
      .limit(10)
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
