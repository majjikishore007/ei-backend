const Publisherrating = require("../models/publisherRating");
const Publisher = require("../models/publisher");

exports.getAllPublisherRatings = async (req, res, next) => {
  try {
    let publisherratings = await Publisherrating.find().sort({ _id: -1 });
    res.status(200).json({ success: true, data: publisherratings });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.savePublisherRating = async (req, res, next) => {
  try {
    const publisherrating = new Publisherrating({
      value: req.body.ratingValue,
      publisher: req.body.publisherId,
      user: req.userData.userId,
      date: Date.now(),
    });
    await publisherrating.save();
    res.status(200).json({ success: true, message: "rating successfully" });
  } catch (error) {
    if (error.code === 11000) {
      await Publisherrating.updateOne(
        { publisher: req.body.publisherId, user: req.userData.userId },
        { $set: { value: req.body.ratingValue } }
      );
      res.status(200).json({ success: true, message: "update rating" });
    } else {
      res.status(500).json({ success: false, error });
    }
  }
};

exports.getRatingForPublisherId = async (req, res, next) => {
  try {
    const publisherId = req.params.publisherId;
    const userId = req.userData.userId;
    let rating = await Publisherrating.findOne({
      publisher: publisherId,
      user: userId,
    });
    res.status(200).json({ success: true, data: rating });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getAllPublishersWithAverageRating = async (req, res, next) => {
  try {
    let allPublishersWithAvgRating = await Publisher.aggregate([
      {
        $lookup: {
          from: Publisherrating.collection.name,
          localField: "_id",
          foreignField: "publisher",
          as: "pubrating",
        },
      },
      { $unwind: { path: "$pubrating", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          verified: { $first: "$verified" },
          email: { $first: "$email" },
          about: { $first: "$about" },
          website: { $first: "$website" },
          address: { $first: "$address" },
          logo: { $first: "$logo" },
          userId: { $first: "$userId" },
          city: { $first: "$city" },
          zip: { $first: "$zip" },
          urlStr: { $first: "$urlStr" },
          count: { $sum: 1 },
          totalRating: { $sum: "$pubrating.value" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          about: 1,
          website: 1,
          address: 1,
          logo: 1,
          userId: 1,
          verified: 1,
          urlStr: 1,
          id: "$_id",
          averageRating: {
            $round: [{ $divide: ["$totalRating", "$count"] }, 1],
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: allPublishersWithAvgRating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
