const Cartoon = require("../models/cartoon");
const mongoose = require("mongoose");
const urlify = require('../util/util')

exports.getInitialcartoons = async (req, res, next) => {
  try {
    let cartoons = await Cartoon.find()
      .sort({ _id: -1 })
      .limit(+req.params.limitCount);
    res.status(200).json({ success: true, data: cartoons });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllCartoonsPagination = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let cartoons = await Cartoon.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: cartoons });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNextbatchCartoons = async (req, res, next) => {
  try {
    let lastCartoonId = req.params.lastCartoonId;
    let cartoons = await Cartoon.find({
      _id: { $lt: mongoose.Types.ObjectId(lastCartoonId) },
    })
      .sort({ _id: -1 })
      .limit(+req.params.limitCount);
    res.status(200).json({ success: true, data: cartoons });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.saveCartoon = async (req, res, next) => {
  try {
    const cartoon = new Cartoon({
      title: req.body.title,
      description: req.body.description,
      cover: req.file.cloudStoragePublicUrl,
      author: req.body.author,
      category: req.body.category,
      date: req.body.date,
      updated_at: Date.now(),
      created_at: Date.now(),
      urlStr: urlify(req.body.title),
    });
    await cartoon.save();
    res.status(201).json({
      success: true,
      message: "cartoon has been uploaded",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getCartoonById = async (req, res, next) => {
  try {
    const id = req.params.cartoonId;
    let cartoon = await Cartoon.findById(id);
    res.status(200).json({ success: true, data: cartoon });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editCartoonById = async (req, res, next) => {
  try {
    const id = req.params.cartoonId;
    await Cartoon.update({ _id: id }, { $set: req.body });
    res.status(200).json({ success: true, message: "data has been updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editCartoonCoverById = async (req, res, next) => {
  try {
    const id = req.params.cartoonId;
    await Cartoon.update(
      { _id: id },
      { $set: { cover: req.file.cloudStoragePublicUrl } }
    );
    res.status(200).json({ success: true, message: "Updated Image" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteCartoonById = async (req, res, next) => {
  try {
    const id = req.params.cartoonId;
    await Cartoon.remove({ _id: id });
    res.status(200).json({ success: true, message: "data has been deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
