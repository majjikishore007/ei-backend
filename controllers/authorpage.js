const AuthorPage = require("../models/author-page");
const Article = require("../models/article");
const mongoose = require("mongoose");

exports.createNewAuthorPage = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res
        .status(200)
        .json({ success: false, message: "Author Name is mandetory" });
    }
    let newAuthorPage = new AuthorPage({
      name: req.body.name,
      coverImage: req.body.coverImage,
      profilePic: req.body.profilePic,
      bio: req.body.bio,
      website: req.body.website,
      articleList: req.body.articleList,
      authorizedUser: req.userData.userId,
      publisher: req.body.publisher,
      organization: req.body.organization,
      urlStr:
        req.body.name.trim().replace(/[&\/\\#, +()$~%.'":;*?!<>{}]+/gi, "-") +
        "-" +
        new Date().valueOf(),
    });
    let authorPage = await newAuthorPage.save();
    let insertedObj = await AuthorPage.findOne({
      urlStr: authorPage.urlStr,
    })
      .populate({
        path: "articleList",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      })
      .populate("claims.claimByUser")
      .populate("authorizedUser");

    res.status(201).json({
      success: true,
      message: "Author Page Created",
      data: insertedObj,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error });
  }
};


exports.getArticlesByAuthorFilter = async (req, res, next) => {
  try {
    const author = req.params.authorSearch;
    let articles = await Article.find({
      author: new RegExp(author, "i"),
      public: true,
      $or: [{ device: "both" }, { device: req.params.device }],
    })
      .sort({ _id: -1 })
      .limit(5)
      .populate("publisher");

    let restructuredResult = articles.map((doc) => {
      return {
        id:doc._id ,
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


exports.uploadImage = async (req, res, next) => {
  try {
    if (req.file.cloudStoragePublicUrl) {
      res.status(200).json({
        success: true,
        message: "Image uploaded",
        imageUrl: req.file.cloudStoragePublicUrl,
      });
    } else {
      res.status(200).json({
        success: false,
        messge: "Image can't upload due to server error",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.updateInfoWithUrlStr = async (req, res, next) => {
  try {
    let updatedPageInfo = await AuthorPage.findOneAndUpdate(
      {
        urlStr: req.params.urlStr,
        authorizedUser: req.userData.userId,
      },
      {
        $set: req.body,
      },
      { new: true }
    )
      .populate({
        path: "articleList",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      })
      .populate("claims.claimByUser")
      .populate("authorizedUser");
    res.status(200).json({
      success: true,
      message: "Author Page Updated",
      data: updatedPageInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.claimRequestAuthorPage = async (req, res, next) => {
  try {
    let temp = [];
    let exist = await AuthorPage.findOne({ urlStr: req.params.urlStr });
    let obj = {
      claimByUser: req.userData.userId,
      claimingDocumentType: req.body.claimingDocumentType,
      claimingDocument: req.body.claimingDocument,
    };
    if (exist.claims) {
      temp = [...exist.claims];
      temp.push(obj);
    }

    let updatedPageInfo = await AuthorPage.findOneAndUpdate(
      {
        $and: [
          { urlStr: req.params.urlStr },
          {
            $or: [
              { claimStatus: "NONE" },
              { claimStatus: "UNDER_VERIFICATION" },
            ],
          },
        ],
      },
      {
        $set: {
          claimStatus: "UNDER_VERIFICATION",
          claims: temp,
        },
      },
      { new: true }
    )
      .populate({
        path: "articleList",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      })
      .populate("claims.claimByUser")
      .populate("authorizedUser");
    res.status(200).json({
      success: true,
      message: "Author Page Updated",
      data: updatedPageInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllAuthorPagePagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let pages = await AuthorPage.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: "articleList",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      })
      .populate("claims.claimByUser")
      .populate("authorizedUser");
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.viewClaimsAuthorPagepagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let pages = await AuthorPage.find({
      claimStatus: "UNDER_VERIFICATION",
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: "articleList",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      })
      .populate("claims.claimByUser")
      .populate("authorizedUser");
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.verifyClaimAuthorPage = async (req, res, next) => {
  try {
    let updatedPageInfo = await AuthorPage.findOneAndUpdate(
      {
        urlStr: req.params.urlStr,
        authorizedUser: req.userData.userId,
      },
      {
        $set: {
          authorizedUser: mongoose.Types.ObjectId(req.body.userId),
          claimStatus: "VERIFIED",
          updatedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate({
        path: "articleList",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      })
      .populate("claims.claimByUser")
      .populate("authorizedUser");
    res.status(200).json({
      success: true,
      message: "Author Page Verified & Updated",
      data: updatedPageInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.checkIfAlreadyClaimed = async (req, res, next) => {
  try {
    let exist = await AuthorPage.findOne({
      $and: [
        { urlStr: req.params.urlStr },
        {
          $or: [{ claimStatus: "NONE" }, { claimStatus: "UNDER_VERIFICATION" }],
        },
        {
          "claims.claimByUser": req.userData.userId,
        },
      ],
    })
      .populate({
        path: "articleList",
        populate: {
          path: "publisher",
          model: "Publisher",
        },
      })
      .populate("claims.claimByUser")
      .populate("authorizedUser");
    if (exist) {
      res.status(200).json({ success: true, claimed: true, data: exist });
    } else {
      res.status(200).json({ success: true, claimed: false, data: null });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
