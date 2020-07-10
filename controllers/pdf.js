const Pdf = require("../models/pdf");
const Publisher = require("../models/publisher");
const mongoose = require("mongoose");

exports.getAllPdfPageWiseLimitWise = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let data = await Pdf.find()
      .populate("publisher")
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getToptenPdf = async (req, res, next) => {
  try {
    let data = await Pdf.find()
      .sort({ _id: -1 })
      .limit(10)
      .populate("publisher");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.savePdfPublisher = async (req, res, next) => {
  try {
    const newPdf = new Pdf({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.file.cloudStoragePublicUrl,
      pdfUrl: req.body.pdfUrl,
      category: req.body.category,
      price: req.body.price,
      publisher: req.body.publisher,
      publishingDate: req.body.publishingDate,
      altImage: req.body.altImage ? req.body.altImage : req.body.title,
      seo: {
        metaTitle: req.body.metaTitle ? req.body.metaTitle : req.body.title,
        metaDescription: req.body.metaDescription
          ? req.body.metaDescription
          : req.body.description,
        metaKeywords: req.body.metaKeywords
          ? req.body.metaKeywords
          : req.body.category,
      },
      urlStr: req.body.title
        .trim()
        .replace(/[&\/\\#, +()$~%.'":;*?<>{}]+/gi, "-"),
      public: true,
    });
    await newPdf.save();
    res.status(201).json({ success: true, message: "Pdf Saved Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.uploadPdf = async (req, res, next) => {
  try {
    if (req.pdfStoragePublicUrl) {
      res.status(200).json({
        success: true,
        message: "Pdf uploaded",
        pdfUrl: req.pdfStoragePublicUrl,
      });
    } else {
      res.status(500).json({
        success: false,
        messge: "Pdf can't upload due to server error",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPdfById = async (req, res, next) => {
  try {
    let data = await Pdf.findById(
      mongoose.Types.ObjectId(req.params.pdfId)
    ).populate("publisher");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPdfByTitle = async (req, res, next) => {
  try {
    let pdf = await Pdf.findOne({
      urlStr: req.params.title,
    }).populate("publisher");
    res.status(200).json({ success: true, data: pdf });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editPdfById = async (req, res, next) => {
  try {
    const id = req.params.pdfId;
    await Pdf.update({ _id: id }, { $set: req.body }, { $new: true });
    res.status(200).json({ success: true, message: "Pdf Details Updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editPdfThumbnailByPdfId = async (req, res, next) => {
  try {
    const id = req.params.pdfId;
    data = {
      thumbnail: req.file.cloudStoragePublicUrl,
    };
    await Pdf.findByIdAndUpdate(id, { $set: data });
    res.status(200).json({
      success: true,
      message: "Pdf Thumbnail updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deletePdfById = async (req, res, next) => {
  try {
    const id = req.params.pdfId;
    await Pdf.remove({ _id: id });
    res.status(200).json({ success: true, message: "Pdf deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllPdfByPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    let pdflist = await Pdf.find({ publisher: id })
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("publisher");
    res.status(200).json({ success: true, data: pdflist });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNoOfPdfForPublisherId = async (req, res, next) => {
  try {
    const id = req.params.publisherId;
    let pdfCount = await Pdf.countDocuments({ publisher: id });
    res.status(200).json({ success: true, count: pdfCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPdfByCategoryFilter = async (req, res, next) => {
  try {
    let pdflist = await Pdf.find({
      category: new RegExp(req.params.categorySearch, "i"),
    }).populate("publisher");
    res.status(200).json({ success: true, data: pdflist });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPdfByPublisherIdAndCategory = async (req, res, next) => {
  try {
    let pdflist = await Pdf.find({
      publisher: req.params.publisherId,
      category: new RegExp(req.params.categorySearch, "i"),
    }).populate("publisher");

    res.status(200).json({ success: true, data: pdflist });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCountOfTotalPdf = async (req, res, next) => {
  try {
    let pdfCount = await Pdf.countDocuments({});
    res.status(200).json({ success: true, count: pdfCount });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
