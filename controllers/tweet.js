const axios = require("axios");
const { twitterToken } = require("../config/database");
const twiterLocId = require("twitter-woeid");
const Tweet = require("../models/tweet");

exports.insertLatestTweets = async () => {
  try {
    /**list of country name in array */
    let countries = ["India"];
    for (let con = 0; con <= countries.length - 1; con++) {
      let token = twitterToken;
      let location = twiterLocId.getSingleWOEID(countries[con]);
      let id = location[0].woeid;
      if (id != undefined) {
        /**save data into collections */
        let url = `https://api.twitter.com/1.1/trends/place.json?id=${id}`;
        let response = await axios.get(url, {
          headers: {
            authorization: token,
          },
        });
        let data = await response.data[0].trends.filter(
          (word) => word.tweet_volume != null
        );

        data = await getTrendsSortedByTweetsCount(data);

        // let insertingData = [];
        for (let i = 0; i <= data.length - 1; i++) {
          let name = data[i].name.toLowerCase();
          if (name[0] == "#") {
            name = name.split("#")[1];
          }
          let tweets = await getTweets(name);

          for (let i = 0; i <= tweets.length - 1; i++) {
            let obj = {};
            let pre = await Tweet.findOneAndUpdate(
              { text: tweets[i].text },
              {
                $set: {
                  tweetId: tweets[i].id.toString(),
                  text: tweets[i].text,
                  user: tweets[i].user,
                  retweeted_status: tweets[i].retweeted_status,
                  lang: tweets[i].lang,
                  entities: tweets[i].entities,
                },
              },
              { new: true }
            );
            // let exist = await search(tweets[i].text, insertingData);
            if (!pre) {
              (obj.tweetId = tweets[i].id.toString()),
                (obj.text = tweets[i].text),
                (obj.user = tweets[i].user),
                (obj.retweeted_status = tweets[i].retweeted_status),
                (obj.lang = tweets[i].lang),
                (obj.entities = tweets[i].entities);
              await new Tweet(obj).save();
              //   insertingData.push(obj);
            }
          }
        }

        // await Tweet.insertMany(insertingData);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

getTweets = async (name) => {
  try {
    let query = name;
    let token = twitterToken;
    let url = `https://api.twitter.com/1.1/tweets/search/30day/developmentExtrainsights.json?query=${query}&maxResults=20`;
    let response = await axios.get(url, {
      headers: {
        authorization: token,
      },
    });
    return response.data.results;
  } catch (error) {
    return [];
  }
};

getTrendsSortedByTweetsCount = async (trends) => {
  let sortedArr = trends.sort(function (a, b) {
    return b.tweet_volume - a.tweet_volume;
  });
  return sortedArr;
};

async function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return 1;
    }
  }
  return 0;
}
