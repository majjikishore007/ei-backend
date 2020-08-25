const Keyword = require("../models/keyword");
const Article = require("../models/article");
const Publisher = require("../models/publisher");
const Blog = require("../models/blog");
const Cartoon = require("../models/cartoon");
const Debate = require("../models/debate");
const Audio = require("../models/audio");
const Video = require("../models/video");

const sw = require("stopword");
const stringSimilarity = require("string-similarity");

exports.getSuggestionsForSearch = async (req, res, next) => {
  try {
    let search = sw.removeStopwords(req.body.searchText.split(" "));
    let strippedText = search.join(" ");
    let results = await Keyword.aggregate([
      {
        $match: {
          $text: {
            $search: strippedText,
          },
        },
      },
      {
        $group: {
          _id: "keyword",
          keywords: {
            $push: "$keyword",
          },
        },
      },
      { $sort: { _id: -1, count: -1 } },
    ]);
    let result = stringSimilarity.findBestMatch(
      strippedText,
      results[0].keywords
    );

    let y = result.ratings.sort(mySorter);

    let z = [];
    y.map((one) => {
      z.push(one.target);
    });

    res.status(200).json({ success: true, data: z.slice(0, 10) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getSearchResultForSearch = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let search = sw.removeStopwords(req.body.searchText.split(" "));
    let strippedText = search.join(" ");
    let parallelProcess = [];
    /**article result */
    let articlesPrm = Article.aggregate([
      {
        $match: {
          $and: [
            { $text: { $search: strippedText } },
            { $or: [{ device: "both" }, { device: req.params.device }] },
          ],
        },
      },
      { $sort: { score: { $meta: "textScore" } } },
      { $sort: { _id: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);

    parallelProcess.push(articlesPrm);

    /**publisher result */
    let publishersPrm = await Publisher.aggregate([
      { $match: { $text: { $search: strippedText } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $sort: { _id: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);

    parallelProcess.push(publishersPrm);

    /**blog result */
    let blogsPrm = await Blog.aggregate([
      { $match: { $text: { $search: strippedText } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $sort: { _id: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);

    parallelProcess.push(blogsPrm);

    /**cartoon result */
    let cartoonsPrm = await Cartoon.aggregate([
      { $match: { $text: { $search: strippedText } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $sort: { _id: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);
    parallelProcess.push(cartoonsPrm);

    /**debate result */
    let debatesPrm = await Debate.aggregate([
      { $match: { $text: { $search: strippedText } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $sort: { _id: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);
    parallelProcess.push(debatesPrm);

    /**audio result */
    let audiosPrm = await Audio.aggregate([
      { $match: { $text: { $search: strippedText } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $sort: { _id: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);
    parallelProcess.push(audiosPrm);

    /**video result */
    let videosPrm = await Video.aggregate([
      { $match: { $text: { $search: strippedText } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $sort: { _id: -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);
    parallelProcess.push(videosPrm);

    let results = await Promise.all(parallelProcess);
    res.status(200).json({
      success: true,
      data: {
        articles: results[0],
        publishers: results[1],
        blogs: results[2],
        cartoons: results[3],
        debates: results[4],
        audios: results[5],
        videos: results[6],
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

function mySorter(a, b) {
  var x = a.rating;
  var y = b.rating;
  return x > y ? -1 : x < y ? 1 : 0;
}
