const Preference = require("../models/preference");
const Article = require("../models/article");
const Audio = require("../models/audio");
const Video = require("../models/video");
const Publisher = require("../models/publisher");
const Keyword = require("../models/keyword");
const mongoose = require("mongoose");

exports.getArticlesWithLimitedPreferencesAndLimitedKeywords = async (
  req,
  res,
  next
) => {
  try {
    let userId = req.userData.userId;

    let preferencePage = parseInt(req.params.preferencePage);
    let preferenceLimit = parseInt(req.params.preferenceLimit);

    let keywordPage = parseInt(req.params.keywordPage);
    let keywordLimit = parseInt(req.params.keywordLimit);

    let articleLimit = parseInt(req.params.articleLimit);

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
    let prmForAudio = [];
    let prmForVideo = [];

    let articleCounts = [];
    let audioCounts = [];
    let videoCounts = [];

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
            category: new RegExp(finalKeywordList[i].keyword, "i"),
          },
        },
        { $sort: { _id: -1 } },
        { $limit: articleCount + 1 },
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
        { $limit: audioCount + 1 },
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
        { $limit: videoCount + 1 },
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

      articleCounts[i] = articleCount;
      videoCounts[i] = videoCount;
      audioCounts[i] = audioCount;
    }

    /**create final list with lastArticleId after promise resolution with shuffled articles */
    let finalList = [];
    let articlesPromisesResponse = await Promise.all(prmForArticle);
    let audioPromisesResponse = await Promise.all(prmForAudio);
    let videoPromisesResponse = await Promise.all(prmForVideo);

    for (let i = 0; i < finalKeywordListLen; i++) {
      let articleCount = articleCounts[i];
      let audioCount = audioCounts[i];
      let videoCount = videoCounts[i];

      let nextbatchArticles = false,
        nextbatchAudios = false,
        nextbatchVideos = false;

      if (articleCount + 1 == articlesPromisesResponse[i].length) {
        nextbatchArticles = true;
        articlesPromisesResponse[i].pop();
      }
      if (audioCount + 1 == audioPromisesResponse[i].length) {
        nextbatchAudios = true;
        audioPromisesResponse[i].pop();
      }
      if (videoCount + 1 == videoPromisesResponse[i].length) {
        nextbatchVideos = true;
        videoPromisesResponse[i].pop();
      }

      let articles = articlesPromisesResponse[i];
      let audios = audioPromisesResponse[i];
      let videos = videoPromisesResponse[i];

      let allItems = await shuffleArray(articles.concat(audios).concat(videos));

      finalList.push({
        keywordData: finalKeywordList[i],
        nextbatchArticles,
        nextbatchAudios,
        nextbatchVideos,
        data: allItems,
      });
    }

    /**create response object with list, lastPreferenceId and lastKeywordId */
    let data = {
      finalList,
      lastPreferenceId,
    };
    /**response back to frontend with response object */
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getNextArticles = async (req, res, next) => {
  try {
    let keyword = req.params.keyword;
    let articlePage = parseInt(req.params.articlePage);
    let articleLimit = parseInt(req.params.articleLimit);

    //checking if audio and video exist
    let articleCount = Math.round(articleLimit / 3);
    let audioCount = Math.round(articleLimit / 3);
    let videoCount = Math.round(articleLimit / 3);

    let existAudio = await Audio.find({
      category: new RegExp(keyword, "i"),
    })
      .sort({ _id: -1 })
      .skip(articlePage * audioCount);
    if (existAudio.length <= 0) {
      articleCount = articleCount + 1;
    }

    let existVideo = await Video.find({
      category: new RegExp(keyword, "i"),
    })
      .sort({ _id: -1 })
      .skip(articlePage * videoCount);

    if (existVideo.length <= 0) {
      articleCount = articleCount + 1;
    }

    let prm = [];

    /**article */
    let articlePrm = Article.aggregate([
      {
        $match: {
          category: new RegExp(keyword, "i"),
        },
      },
      { $sort: { _id: -1 } },
      { $skip: articlePage * articleCount },
      { $limit: articleCount + 1 },
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
    prm.push(articlePrm);

    /**audio */
    let audioPrm = Audio.aggregate([
      {
        $match: {
          category: new RegExp(keyword, "i"),
        },
      },
      { $sort: { _id: -1 } },
      { $skip: articlePage * audioCount },
      { $limit: audioCount + 1 },
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
    prm.push(audioPrm);

    /**video */
    let videoPrm = Video.aggregate([
      {
        $match: {
          category: new RegExp(keyword, "i"),
        },
      },
      { $sort: { _id: -1 } },
      { $skip: articlePage * videoCount },
      { $limit: videoCount + 1 },
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
    prm.push(videoPrm);

    let resp = await Promise.all(prm);

    let nextbatchArticles = false,
      nextbatchAudios = false,
      nextbatchVideos = false;

    if (articleCount + 1 == resp[0].length) {
      nextbatchArticles = true;
      resp[0].pop();
    }
    if (audioCount + 1 == resp[1].length) {
      nextbatchAudios = true;
      resp[1].pop();
    }
    if (videoCount + 1 == resp[2].length) {
      nextbatchVideos = true;
      resp[2].pop();
    }

    let articles = resp[0];
    let audios = resp[1];
    let videos = resp[2];

    let allItems = await shuffleArray(articles.concat(audios).concat(videos));

    let data = {
      keyword,
      nextbatchArticles,
      nextbatchAudios,
      nextbatchVideos,
      data: allItems,
    };
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.getKeywordsWithArticles = async (req, res, next) => {
  try {
    let keywordPage = parseInt(req.params.keywordPage);
    let keywordLimit = parseInt(req.params.keywordLimit);
    let articleLimit = parseInt(req.params.articleLimit);

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

    let finalKeywordList = await shuffleArray(keywords);

    /************************************************ */
    /**get articles with promise */
    let prmForArticle = [];
    let prmForAudio = [];
    let prmForVideo = [];

    let articleCounts = [];
    let audioCounts = [];
    let videoCounts = [];

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
            category: new RegExp(finalKeywordList[i].keyword, "i"),
          },
        },
        { $sort: { _id: -1 } },
        { $limit: articleCount + 1 },
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
        { $limit: audioCount + 1 },
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
        { $limit: videoCount + 1 },
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

      articleCounts[i] = articleCount;
      videoCounts[i] = videoCount;
      audioCounts[i] = audioCount;
    }

    /**create final list with lastArticleId after promise resolution with shuffled articles */
    let finalList = [];
    let articlesPromisesResponse = await Promise.all(prmForArticle);
    let audioPromisesResponse = await Promise.all(prmForAudio);
    let videoPromisesResponse = await Promise.all(prmForVideo);

    for (let i = 0; i < finalKeywordListLen; i++) {
      let articleCount = articleCounts[i];
      let audioCount = audioCounts[i];
      let videoCount = videoCounts[i];

      let nextbatchArticles = false,
        nextbatchAudios = false,
        nextbatchVideos = false;

      if (articleCount + 1 == articlesPromisesResponse[i].length) {
        nextbatchArticles = true;
        articlesPromisesResponse[i].pop();
      }
      if (audioCount + 1 == audioPromisesResponse[i].length) {
        nextbatchAudios = true;
        audioPromisesResponse[i].pop();
      }
      if (videoCount + 1 == videoPromisesResponse[i].length) {
        nextbatchVideos = true;
        videoPromisesResponse[i].pop();
      }

      let articles = articlesPromisesResponse[i];
      let audios = audioPromisesResponse[i];
      let videos = videoPromisesResponse[i];

      let allItems = await shuffleArray(articles.concat(audios).concat(videos));

      finalList.push({
        keywordData: finalKeywordList[i],
        nextbatchArticles,
        nextbatchAudios,
        nextbatchVideos,
        data: allItems,
      });
    }

    /**create response object with list*/
    let data = {
      finalList,
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
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
