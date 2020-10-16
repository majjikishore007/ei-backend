const CuratorPage = require("../models/curator-page");
const Article = require("../models/article");
const mongoose = require("mongoose");
const urlify = require('../util/util')

exports.createNewCuratorPage = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res
        .status(200)
        .json({ success: false, message: "Curator Name is mandetory" });
    }
    let newCuratorPage = new CuratorPage({
      name: req.body.name,
      coverImage: req.body.coverImage,
      profilePic: req.body.profilePic,
      bio: req.body.bio,
      journalist: req.body.journalist,
      publishers:req.body.publishers,
      website: req.body.website,
      socialLinks:req.body.socialLinks,
      speciality:req.body.speciality,
      categories:req.body.categories,
      languages:req.body.languages,
      contactEmailVisible:req.body.contactEmailVisible,
      associationDetail:req.body.associationDetail,
      articleList: req.body.articleList,
      authorizedUser: req.userData.userId,
      organization: req.body.organization,
      urlStr:urlify(req.body.name) +
        "-" +
        new Date().valueOf(),
    });
    let curatorPage = await newCuratorPage.save();
    let insertedObj = await CuratorPage.findOne({
      urlStr: curatorPage.urlStr,
    })
    .populate("publishers.existingPublishers")
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
      message: "Curator Page Created",
      data: insertedObj,
    });
  } catch (error) {
    console.log(error)
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
    let updatedPageInfo = await CuratorPage.findOneAndUpdate(
      {
        urlStr: req.params.urlStr,
        authorizedUser: req.userData.userId,
      },
      {
        $set: req.body,
      },
      { new: true }
    )
    .populate("publishers.existingPublishers")
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
      message: "Curator Page Updated",
      data: updatedPageInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.claimRequestCuratorPage = async (req, res, next) => {
  try {
    let temp = [];
    let exist = await CuratorPage.findOne({ urlStr: req.params.urlStr });
    let obj = {
      claimByUser: req.userData.userId,
      claimingDocumentType: req.body.claimingDocumentType,
      claimingDocument: req.body.claimingDocument,
    };
    if (exist.claims) {
      temp = [...exist.claims];
      temp.push(obj);
    }

    let updatedPageInfo = await CuratorPage.findOneAndUpdate(
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
    .populate("publishers.existingPublishers")
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
      message: "Curator Page Updated",
      data: updatedPageInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllCuratorPagePagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let pages = await CuratorPage.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publishers.existingPublishers")
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

exports.getSingleCuratorPage = async (req, res, next) => {
  try {
   let urlStr = req.params.urlStr

    let pages = await CuratorPage.findOne({urlStr : urlStr})
      .sort({ _id: -1 })
      .populate("publishers.existingPublishers")
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

exports.viewClaimsCuratorPagepagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let pages = await CuratorPage.find({
      claimStatus: "UNDER_VERIFICATION",
    })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publishers.existingPublishers")
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

exports.verifyClaimCuratorPage = async (req, res, next) => {
  try {
    let updatedPageInfo = await CuratorPage.findOneAndUpdate(
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
    .populate("publishers.existingPublishers")
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
      message: "Curator Page Verified & Updated",
      data: updatedPageInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.checkIfAlreadyClaimed = async (req, res, next) => {
  try {
    let exist = await CuratorPage.findOne({
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
    .populate("publishers.existingPublishers")
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
