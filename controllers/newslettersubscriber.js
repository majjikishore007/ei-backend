const NewsletterSubscriber = require("../models/newsletter_subscriber");

exports.addSubscriber = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.json({ success: false, message: "Please provide email" });
    }
    let exist = await NewsletterSubscriber.findOne({ email: req.body.email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "newsletter already subscribed" });
    }
    let data = {
      email: req.body.email,
    };
    let newsletterSubscriber = new NewsletterSubscriber(data);
    await newsletterSubscriber.save();
    res.status(201).json({ success: true, message: "Newsletter subscribed" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getNewsletterSubscribersPaginationwise = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let result = await NewsletterSubscriber.find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
