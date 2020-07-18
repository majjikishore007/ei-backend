const Preference = require("../models/preference");
const Keyword = require("../models/keyword");
const mongoose = require("mongoose");

// exports.getAllPreferences = async (req, res, next) => {
//   try {
//     let preferences = await Preference.find()
//       .sort("-_id")
//       .populate("user", "displayName")
//       .populate("keyword");
//     res.status(200).json({ success: true, data: preferences });
//   } catch (error) {
//     res.status(500).json({ success:false, error });
//   }
// };

exports.getAllPreferencesForLoggedinUser = async (req, res, next) => {
  try {
    let userId = req.userData.userId;
    let preferences = await Preference.find({ user: userId })
      .sort({ _id: -1 })
      .populate("keyword");
    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPeferencesPaginationwise = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let userId = req.userData.userId;

    let preferences = await Preference.find({ user: userId })
      .sort({ _id: -1 })
      .populate("keyword")
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.addPreferences = async (req, res, next) => {
  try {
    /**if user already present then update preferences */
    let exist = await Preference.findOne({
      user: req.userData.userId,
      keyword: req.body.keyword,
    });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "Prefernce already added" });
    }
    /**new user preference save */
    const preference = new Preference({
      user: req.userData.userId,
      keyword: req.body.keyword,
    });
    let addedPreferences = await preference.save();
    res.status(201).json({ success: true, data: addedPreferences });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getPreferenceSearchingSuggestions = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const searchPreference = req.params.searchPreference;

    let keywords = await Keyword.aggregate([
      { $match: { keyword: new RegExp(searchPreference, "i") } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: Preference.collection.name,
          let: { keywordId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$keyword", "$$keywordId"] },
                    {
                      $eq: ["$user", mongoose.Types.ObjectId(userId)],
                    },
                  ],
                },
              },
            },
          ],
          as: "keywordData",
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          count: 1,
          for: 1,
          against: 1,
          created_at: 1,
          updated_at: 1,
          keyword: 1,
          selected: {
            $cond: {
              if: {
                $eq: [{ $size: "$keywordData" }, 0],
              },
              then: false,
              else: true,
            },
          },
        },
      },
    ]);
    res.status(200).json({ success: true, data: keywords });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.deleteUserPreferencesByKeywordId = async (req, res) => {
  try {
    await Preference.remove({
      user: req.userData.userId,
      keyword: req.params.keywordId,
    });
    res.status(200).json({ success: true, message: "Preference deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
