const Newsfeed = require("../models/newsfeed");
const User = require("../models/user");
const Preference = require("../models/preference");
const Keyword = require("../models/keyword");
const Article = require("../models/article");
const mongoose = require("mongoose");
const Publisher = require("../models/publisher");
const Audio = require("../models/audio");
const Video = require("../models/video");

exports.saveNewsfeedForMobile = async () => {
  try {
    let users = await User.find({}).sort({ _id: -1 });
    /**only fetch for those users
     * 1. paid / trial
     * 2. email verified
     * 3. last login(add field in user and mainatain)
     */

    for (let i = 0; i < users.length - 1; i++) {
      let userId = users[i]._id;

      let preferencePage = 0;
      let preferenceLimit = 4;

      let keywordPage = 0;
      let keywordLimit = 4;

      let articleLimit = 4;

      /**get preference list for loggedin user */
      let preferences = await Preference.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $sort: { _id: -1 } },
        { $skip: preferencePage * preferenceLimit },
        { $limit: preferenceLimit },
        {
          $lookup: {
            from: Keyword.collection.name,
            localField: "keyword",
            foreignField: "_id",
            as: "keywordData",
          },
        },
        { $unwind: "$keywordData" },
        {
          $project: {
            // _id: "$keywordData._id",
            count: "$keywordData.count",
            keyword: "$keywordData.keyword",
          },
        },
      ]);

      /**get top counter keyword list */
      let keywords = await Keyword.aggregate([
        { $sort: { count: -1, _id: -1 } },
        { $skip: keywordPage * keywordLimit },
        { $limit: keywordLimit },
        {
          $project: {
            keyword: 1,
            count: 1,
          },
        },
      ]);

      /**get lastPreferenceId */
      let lastPreferenceId;
      if (preferences.length > 0) {
        lastPreferenceId = preferences[preferences.length - 1]._id;
      } else {
        lastPreferenceId = null;
      }

      /**add preferences and keyword array and remove duplicates */

      let finalKeywordList = [...preferences, ...keywords].filter(
        (v, i, a) => a.findIndex((t) => t.keyword === v.keyword) === i
      );
      /**get that array shuffled */
      finalKeywordList = await shuffleArray(finalKeywordList);

      /**get articles with promise */
      let prmForArticle = [];

      let finalKeywordListLen = finalKeywordList.length;
      for (let i = 0; i < finalKeywordListLen; i++) {
        /**article */
        let articlePrm = Article.aggregate([
          {
            $match: {
              $and: [
                { category: new RegExp(finalKeywordList[i].keyword, "i") },
                { $or: [{ device: "both" }, { device: "app" }] },
              ],
            },
          },
          { $sort: { _id: -1 } },
          { $limit: articleLimit },
          {
            $lookup: {
              from: Publisher.collection.name,
              localField: "publisher",
              foreignField: "_id",
              as: "publisherData",
            },
          },
          { $unwind: "$publisherData" },
          {
            $project: {
              _id: 0,
              title: 1,
              description: 1,
              price: 1,
              author: 1,
              cover: 1,
              publisher: "$publisherData",
              website: 1,
              category: 1,
              time: 1,
              date: "$publishingDate",
              id: "$_id",
              lan: 1,
              urlStr: 1,
              public: 1,
              created_at: 1,
              type: "article",
            },
          },
        ]);
        prmForArticle.push(articlePrm);
      }

      /**create final list with lastArticleId after promise resolution with shuffled articles */
      let finalList = [];
      let articlesPromisesResponse = await Promise.all(prmForArticle);

      for (let i = 0; i < finalKeywordListLen; i++) {
        let articles = articlesPromisesResponse[i];

        let allItems = await shuffleArray(articles);

        finalList.push({
          keywordData: finalKeywordList[i],
          data: allItems,
        });
      }

      /**create response object with list, lastPreferenceId and lastKeywordId */
      let data = {
        finalList,
        lastPreferenceId,
      };

      let exist = await Newsfeed.findOne({ user: userId });
      if (exist) {
        await Newsfeed.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              mobileFeed: data,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );
      } else {
        await new Newsfeed({
          user: userId,
          mobileFeed: data,
        }).save();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.saveNewsfeedForWebsite = async () => {
  try {
    let users = await User.find({}).sort({ _id: -1 });
    /**only fetch for those users
     * 1. paid / trial
     * 2. email verified
     * 3. last login(add field in user and mainatain)
     */
    for (let i = 0; i < users.length - 1; i++) {
      let userId = users[i]._id;

      let preferencePage = 0;
      let preferenceLimit = 4;

      let keywordPage = 0;
      let keywordLimit = 4;

      let articleLimit = 3;

      let kwPrm = [];
      /**get preference list for loggedin user */
      let preferencesPrm = Preference.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $sort: { _id: -1 } },
        { $skip: preferencePage * preferenceLimit },
        { $limit: preferenceLimit },
        {
          $lookup: {
            from: Keyword.collection.name,
            localField: "keyword",
            foreignField: "_id",
            as: "keywordData",
          },
        },
        { $unwind: "$keywordData" },
        {
          $project: {
            // _id: "$keywordData._id",
            count: "$keywordData.count",
            keyword: "$keywordData.keyword",
          },
        },
      ]);
      kwPrm.push(preferencesPrm);

      /**get top counter keyword list */
      let keywordsPrm = Keyword.aggregate([
        { $sort: { count: -1, _id: -1 } },
        { $skip: keywordPage * keywordLimit },
        { $limit: keywordLimit },
        {
          $project: {
            keyword: 1,
            count: 1,
          },
        },
      ]);
      kwPrm.push(keywordsPrm);

      let resp = await Promise.all(kwPrm);

      let preferences = resp[0];
      let keywords = resp[1];

      /**get lastPreferenceId */
      let lastPreferenceId;
      if (preferences.length > 0) {
        lastPreferenceId = preferences[preferences.length - 1]._id;
      } else {
        lastPreferenceId = null;
      }

      /**add preferences and keyword array and remove duplicates */

      let finalKeywordList = [...preferences, ...keywords].filter(
        (v, i, a) => a.findIndex((t) => t.keyword === v.keyword) === i
      );
      /**get that array shuffled */
      finalKeywordList = await shuffleArray(finalKeywordList);

      /**get articles with promise */
      let prmForArticle = [];
      let prmForAudio = [];
      let prmForVideo = [];

      let finalKeywordListLen = finalKeywordList.length;
      for (let i = 0; i < finalKeywordListLen; i++) {
        //checking if audio and video exist
        let articleCount = Math.round(articleLimit / 3);
        let audioCount = Math.round(articleLimit / 3);
        let videoCount = Math.round(articleLimit / 3);

        let existAudio = await Audio.findOne({
          category: new RegExp(finalKeywordList[i].keyword, "i"),
        });
        if (!existAudio) {
          articleCount = articleCount + 1;
        }

        let existVideo = await Video.findOne({
          category: new RegExp(finalKeywordList[i].keyword, "i"),
        });
        if (!existVideo) {
          articleCount = articleCount + 1;
        }

        /**article */
        let articlePrm = Article.aggregate([
          {
            $match: {
              $and: [
                { category: new RegExp(finalKeywordList[i].keyword, "i") },
                { $or: [{ device: "both" }, { device: "website" }] },
              ],
            },
          },
          { $sort: { _id: -1 } },
          { $limit: articleCount },
          {
            $lookup: {
              from: Publisher.collection.name,
              localField: "publisher",
              foreignField: "_id",
              as: "publisherData",
            },
          },
          { $unwind: "$publisherData" },
          {
            $project: {
              _id: 0,
              title: 1,
              description: 1,
              price: 1,
              author: 1,
              cover: 1,
              publisher: "$publisherData",
              website: 1,
              category: 1,
              time: 1,
              date: "$publishingDate",
              id: "$_id",
              lan: 1,
              urlStr: 1,
              public: 1,
              created_at: 1,
              type: "article",
            },
          },
        ]);
        prmForArticle.push(articlePrm);

        /**audio */
        let audioPrm = Audio.aggregate([
          {
            $match: {
              category: new RegExp(finalKeywordList[i].keyword, "i"),
            },
          },
          { $sort: { _id: -1 } },
          { $limit: audioCount },
          {
            $lookup: {
              from: Publisher.collection.name,
              localField: "publisher",
              foreignField: "_id",
              as: "publisherData",
            },
          },
          { $unwind: "$publisherData" },
          {
            $project: {
              _id: 0,
              title: 1,
              description: 1,
              price: 1,
              thumbnail: 1,
              cover: "$thumbnail",
              audioUrl: 1,
              publisher: "$publisherData",
              category: 1,
              date: "$publishingDate",
              id: "$_id",
              altImage: 1,
              externalLink: 1,
              urlStr: 1,
              public: 1,
              type: "audio",
            },
          },
        ]);

        prmForAudio.push(audioPrm);

        /**video */
        let videoPrm = Video.aggregate([
          {
            $match: {
              category: new RegExp(finalKeywordList[i].keyword, "i"),
            },
          },
          { $sort: { _id: -1 } },
          { $limit: videoCount },
          {
            $lookup: {
              from: Publisher.collection.name,
              localField: "publisher",
              foreignField: "_id",
              as: "publisherData",
            },
          },
          { $unwind: "$publisherData" },
          {
            $project: {
              _id: 0,
              title: 1,
              description: 1,
              price: 1,
              thumbnail: 1,
              cover: "$thumbnail",
              videoUrl: 1,
              publisher: "$publisherData",
              category: 1,
              date: "$publishingDate",
              id: "$_id",
              altImage: 1,
              urlStr: 1,
              externalLink: 1,
              public: 1,
              type: "video",
            },
          },
        ]);

        prmForVideo.push(videoPrm);
      }

      /**create final list with lastArticleId after promise resolution with shuffled articles */
      let finalList = [];
      let articlesPrm = Promise.all(prmForArticle);
      let audioPrm = Promise.all(prmForAudio);
      let videoPrm = Promise.all(prmForVideo);

      let allResp = await Promise.all([articlesPrm, audioPrm, videoPrm]);
      let articlesPromisesResponse = allResp[0];
      let audioPromisesResponse = allResp[1];
      let videoPromisesResponse = allResp[2];

      for (let i = 0; i < finalKeywordListLen; i++) {
        let articles = articlesPromisesResponse[i];
        let audios = audioPromisesResponse[i];
        let videos = videoPromisesResponse[i];

        let allItems = await shuffleArray(
          articles.concat(audios).concat(videos)
        );

        finalList.push({
          keywordData: finalKeywordList[i],
          data: allItems,
        });
      }

      /**create response object with list, lastPreferenceId and lastKeywordId */
      let data = {
        finalList,
        lastPreferenceId,
      };
      let exist = await Newsfeed.findOne({ user: userId });
      if (exist) {
        await Newsfeed.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              websiteFeed: data,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );
      } else {
        await new Newsfeed({
          user: userId,
          websiteFeed: data,
        }).save();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const shuffleArray = async (array) => {
  let len = array.length;
  for (let i = len - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
