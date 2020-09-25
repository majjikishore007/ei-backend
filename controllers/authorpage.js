const AuthorPage = require("../models/author-page");

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
        req.body.name.trim().replace(/[&\/\\#, +()$~%.'":;*?<>{}]+/gi, "-") +
        "-" +
        new Date().valueOf(),
    });
    let authorPage = await newAuthorPage.save();
    res.status(201).json({
      success: true,
      message: "Author Page Created",
      data: authorPage,
    });
  } catch (error) {
    console.log(error);
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
        urlStr: req.param.urlStr,
        authorizedUser: req.userData.userId,
      },
      {
        $set: req.body,
      },
      { new: true }
    );
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
    let exist = await AuthorPage.findOne({ urlStr: req.param.urlStr });
    exist.claims.push({
      claimByUser: req.userData.userId,
      claimingDocumentType: req.body.claimingDocumentType,
      claimingDocument: req.body.claimingDocument,
    });

    let updatedPageInfo = await AuthorPage.findOneAndUpdate(
      {
        $and: [
          { urlStr: req.param.urlStr },
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
          claims: exist.claims,
        },
      },
      { new: true }
    );
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
      .limit(limit);
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
      .limit(limit);
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.verifyClaimAuthorPage = async (req, res, next) => {
  try {
    let updatedPageInfo = await AuthorPage.findOneAndUpdate(
      {
        urlStr: req.param.urlStr,
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
    );
    res.status(200).json({
      success: true,
      message: "Author Page Verified & Updated",
      data: updatedPageInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
