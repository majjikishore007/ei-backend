const NominatePublisher = require("../models/nominate_publisher");

exports.addPublisher = async (req, res, next) => {
  try {
    let data = {
      name: req.body.name.toLowerCase(),
      website: req.body.website,
      userId: req.userData.userId,
    };
    let nominatePublisher = new NominatePublisher(data);
    await nominatePublisher.save();
    res
      .status(201)
      .json({ success: true, message: "Publisher successfully nominated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNominatedPublishersPaginationwise = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let result = await NominatePublisher.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNominatedPublishersAggregate = async (req, res, next) => {
  try {
    let result = await NominatePublisher.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          name: { $first: "$website" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
