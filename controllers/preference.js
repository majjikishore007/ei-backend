const Preference = require("../models/preference");

exports.getAllPreferences = async (req, res, next) => {
  try {
    let preferences = await Preference.find()
      .sort("-_id")
      .populate("user", "displayName");
    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.addPreferences = async (req, res, next) => {
  try {
    const preference = new Preference({
      user: req.body.user,
      category: req.body.category,
    });
    let addedPreferences = await preference.save();
    res.status(201).json({ success: true, data: addedPreferences });
  } catch (error) {
    res.status(500).json({ error });
  }
};
