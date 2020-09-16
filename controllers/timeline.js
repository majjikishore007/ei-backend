const Timeline = require("../models/timeline");
const TimelineTopic = require("../models/timeline-topic");
const Article = require("../models/article");
const Publisher = require("../models/publisher");
const mongoose = require("mongoose");

/**for admin insertion updation deletion and fetch section */

exports.saveNewTimeline = async (req, res, next) => {
  try {
    let timelineTopic = {
      keyword: req.body.keyword,
      description: req.body.description,
      helpingKeywords: req.body.helpingKeywords,
    };
    let addedTimelineTopic = await new TimelineTopic(timelineTopic).save();
    let timelineLen = req.body.timeline.length;
    for (let i = 0; i < timelineLen; i++) {
      let prm = [];
      let obj = {
        timelineTopic: addedTimelineTopic._id,
        date: req.body.timeline[i].date,
        shortDescription: req.body.timeline[i].shortDescription,
        longDescription: req.body.timeline[i].longDescription,
        articles: req.body.timeline[i].articles,
        audio: req.body.timeline[i].audio,
        video: req.body.timeline[i].video,
      };
      let y = new Timeline(obj).save();
      prm.push(y);
      await Promise.all(prm);
    }
    res.status(201).json({ success: true, message: "Timeline saved" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editTimelineTopicDetails = async (req, res, next) => {
  try {
    let timelineTopicId = mongoose.Types.ObjectId(req.params.timelineTopicId);
    let date = req.params.date;
    await TimelineTopic.findOneAndUpdate(
      {
        _id: timelineTopicId,
      },
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Timeline Topic details is Updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.editTimelineForDateWithTimeineTopicId = async (req, res, next) => {
  try {
    let timelineTopicId = mongoose.Types.ObjectId(req.params.timelineTopicId);
    let date = req.params.date;
    await Timeline.findOneAndUpdate(
      {
        timelineTopic: timelineTopicId,
        date: date,
      },
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Timeline for date is Updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteTimelineTopic = async (req, res, next) => {
  try {
    let timelineTopicId = mongoose.Types.ObjectId(req.params.timelineTopicId);
    await Timeline.remove({ timelineTopic: timelineTopicId });
    await TimelineTopic.deleteMany({
      _id: timelineTopicId,
    });
    res
      .status(200)
      .json({ success: true, message: "Timeline Topic is deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.deleteTimelineDate = async (req, res, next) => {
  try {
    let timelineTopicId = mongoose.Types.ObjectId(req.params.timelineTopicId);
    let date = req.params.date;
    await Timeline.remove({
      timelineTopic: timelineTopicId,
      date: date,
    });
    res
      .status(200)
      .json({ success: true, message: "Timeline for date is deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getSingleTimelineTopic = async (req, res, next) => {
  try {
    let timelineTopicId = mongoose.Types.ObjectId(req.params.timelineTopic);
    let timelineTopic = await TimelineTopic.findOne({
      _id: timelineTopicId,
    }).populate("keyword", "keyword");
    res.status(200).json({ success: true, data: timelineTopic });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getSingleTimelineData = async (req, res, next) => {
  try {
    let timelineTopic = mongoose.Types.ObjectId(req.params.timelineTopic);
    let timeline = await Timeline.find(
      {
        timelineTopic: timelineTopic,
      },
      { timelineTopic: 0 }
    ).populate({
      path: "articles",
      populate: {
        path: "publisher",
        model: "Publisher",
      },
    }).populate({
      path: "audio",
      populate: {
        path: "publisher",
        model: "Publisher",
      },
    }).populate({
      path: "video",
      populate: {
        path: "publisher",
        model: "Publisher",
      },
    })

    let timelineTopicData = await TimelineTopic.findOne({
      _id: timelineTopic,
    }).populate("keyword", "keyword");
    let responseObj = {
      timelineTopic: timelineTopicData,
      timeline,
    };
    res.status(200).json({ success: true, data: responseObj });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getTimelinesForAdminPaginationWise = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let timelineTopics = await TimelineTopic.find()
      .populate("keyword", "keyword")
      .skip(page * limit)
      .limit(limit);

    if (!timelineTopics) {
      return res.status(200).json({ success: false, message: "No data Found" });
    }
    let timelineTopicsLen = timelineTopics.length;
    for (let i = 0; i < timelineTopicsLen; i++) {
      let timelineTopic = timelineTopics[i]._id;
      let timeLines = await Timeline.find({
        timelineTopic: timelineTopic,
      }).sort({
        date: -1,
      });
      if (timeLines) {
        let count = 0;
        timeLines.forEach((one) => {
          count += one.articles.length;
        });
        let lastdatearticles = await Timeline.findOne({
          timelineTopic: timelineTopic,
          date: timeLines[0].date,
        });
        let responseObj = {
          _id: timelineTopic,
          keywordData: timelineTopics[i].keyword,
          totalCount: count,
          lastDateCount: lastdatearticles.articles.length,
        };
        res.status(200).json({ success: true, data: responseObj });
      } else {
        let responseObj = {
          _id: timelineTopic,
          keywordData: timelineTopics[i].keyword,
          totalCount: 0,
          lastDateCount: 0,
        };
        res.status(200).json({ success: true, data: responseObj });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

/** api controllers for newsfeed fetch section */

exports.getNextbatchArticles = async (req, res, next) => {
  try {
    let articlepage = parseInt(req.params.articlepage);
    let articlelimit = parseInt(req.params.articlelimit);

    let timelineTopic = mongoose.Types.ObjectId(req.params.timelineTopic);

    let nextbatchArticles = await Timeline.aggregate([
      { $match: { timelineTopic: timelineTopic } },
      {
        $group: {
          _id: "$timelineTopic",
          articleList: {
            $push: "$articles",
          },
        },
      },
      {
        $project: {
          dateList: 1,
          articles: {
            $reduce: {
              input: "$articleList",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
      {
        $lookup: {
          from: Article.collection.name,
          let: { articleId: "$articles" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$articleId"],
                },
              },
            },
            {
              $sort: {
                publishingDate: -1,
              },
            },
            { $skip: articlepage * articlelimit },
            { $limit: articlelimit },
            {
              $lookup: {
                from: Publisher.collection.name,
                localField: "publisher",
                foreignField: "_id",
                as: "publisherData",
              },
            },
            { $unwind: "$publisherData" },
          ],
          as: "articleData",
        },
      },
      {
        $project: {
          articles: 0,
        },
      },
    ]);
    res.status(200).json({ success: true, data: nextbatchArticles });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getArticlesfromGivenDate = async (req, res, next) => {
  try {
    let articlepage = parseInt(req.params.articlepage);
    let articlelimit = parseInt(req.params.articlelimit);

    let timelineTopic = mongoose.Types.ObjectId(req.params.timelineTopic);

    let givenDate = new Date(req.params.givenDate);

    let timelines = await Timeline.aggregate([
      {
        $match: {
          timelineTopic: timelineTopic,
          date: { $lte: givenDate },
        },
      },
      {
        $group: {
          _id: "$timelineTopic",
          articleList: {
            $push: "$articles",
          },
          audioList: {
            $push: "$audio",
          },
          videoist: {
            $push: "$video",
          },
        },
      },
      {
        $project: {
          dateList: 1,
          articles: {
            $reduce: {
              input: "$articleList",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
      {
        $lookup: {
          from: Article.collection.name,
          let: { articleId: "$articles" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$articleId"],
                },
              },
            },
            {
              $sort: {
                publishingDate: -1,
              },
            },
            { $skip: articlepage * articlelimit },
            { $limit: articlelimit },
            {
              $lookup: {
                from: Publisher.collection.name,
                localField: "publisher",
                foreignField: "_id",
                as: "publisherData",
              },
            },
            { $unwind: "$publisherData" },
          ],
          as: "articleData",
        },
      },
      {
        $project: {
          articles: 0,
        },
      },
    ]);
    res.status(200).json({ success: true, data: timelines });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.getTimelineDataPagewiseLimitwise = async (req, res, next) => {
  try {
    /**get limit and next page count for timelinetopic */
    let timelinepage = parseInt(req.params.timelinepage);
    let timelinelimit = parseInt(req.params.timelinelimit);

    /**get limit and next page count for articles */
    let articlepage = parseInt(req.params.articlepage);
    let articlelimit = parseInt(req.params.articlelimit);

    /**timeline carousel subArraySize */
    let carouselSize = parseInt(req.params.carouselSize);

    /**getting limited timelinetopic list */
    let timelineTopics = await TimelineTopic.find()
      .sort({ _id: -1 })
      .skip(timelinepage * timelinelimit)
      .limit(timelinelimit)
      .populate("keyword", "keyword");

    /**loop through timelinetopic list */

    let timelinetopicLen = timelineTopics.length;
    let prm = [];
    for (let i = 0; i < timelinetopicLen; i++) {
      let tprm = Timeline.aggregate([
        { $match: { timelineTopic: timelineTopics[i]._id } },
        {
          $group: {
            _id: "$timelineTopic",
            articleList: {
              $push: "$articles",
            },
            audioList: {
               $push: "$audio",
             },
             videoist: {
               $push: "$video",
             },
            dateList: {
              $push: "$date",
            },
          },
        },
        {
          $project: {
            dateList: 1,
            articles: {
              $reduce: {
                input: "$articleList",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
        {
          $lookup: {
            from: Article.collection.name,
            let: { articleId: "$articles" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$articleId"],
                  },
                },
              },
              {
                $sort: {
                  publishingDate: -1,
                },
              },
              { $skip: articlepage * articlelimit },
              { $limit: articlelimit },
              {
                $lookup: {
                  from: Publisher.collection.name,
                  localField: "publisher",
                  foreignField: "_id",
                  as: "publisherData",
                },
              },
              { $unwind: "$publisherData" },
            ],
            as: "articleData",
          },
        },
        {
          $project: {
            articles: 0,
          },
        },
      ]);

      prm.push(tprm);
    }

    /**after promises resolve */

    let prmResp = await Promise.all(prm);

    /**create final list with articles for selected range of dates sorted by publishing date */
    let finalResponse = [];
    for (let i = 0; i < timelinetopicLen; i++) {
      let obj = {
        timelineTopic: timelineTopics[i]._id,
        keyword: timelineTopics[i].keyword,
        description:
          timelineTopics[i].description && timelineTopics[i].description,
        dateList: makeSubsetOfDateList(prmResp[i][0].dateList, carouselSize),
        articles: prmResp[i][0].articleData,
      };
      finalResponse.push(obj);
    }
    res.status(200).json({ success: true, data: finalResponse });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const makeSubsetOfDateList = (inputArray, subArraySize) => {
  let responseArray = [];
  const carouselcount = inputArray.length / subArraySize;
  for (var x = 0; x < carouselcount; x++) {
    responseArray.push(
      inputArray.slice(x * subArraySize, x * subArraySize + subArraySize)
    );
  }
  return responseArray;
};