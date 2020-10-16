const axios = require("axios");
const { twitterToken } = require("../config/database");
const twiterLocId = require("twitter-woeid");
const TwitterTrend = require("../models/twitter-trend");

exports.collectLatestKeywords = async () => {
  /**list of country name in array */
  let countries = ["India"];
  for (let con = 0; con <= countries.length - 1; con++) {
    let token = twitterToken;
    let location = twiterLocId.getSingleWOEID(countries[con]);
    let id = location[0].woeid;
    let country = location[0].country;
    if (id != undefined) {
      /**save data into collections */
      let url = `https://api.twitter.com/1.1/trends/place.json?id=${id}`;
      let response = await axios.get(url, {
        headers: {
          authorization: token,
        },
      });
      //   console.log(response.data[0].trends);
      let data = response.data[0].trends;

      let insertingData = [];
      for (let i = 0; i <= data.length - 1; i++) {
        let present = await TwitterTrend.findOne({
          name: data[i].name.toLowerCase(),
        });
        if (present) {
          await TwitterTrend.findOneAndUpdate(
            { name: data[i].name.toLowerCase() },
            {
              $set: {
                trending_at: new Date(),
              },
            },
            { new: true }
          );
        }
        /**create object */
        let obj = {};
        if (data[i].name) {
          obj.name = data[i].name.toLowerCase();
        }
        if (data[i].url) {
          obj.url = data[i].url;
        }
        if (data[i].query) {
          obj.query = data[i].query;
        }
        if (data[i].tweet_volume != null) {
          obj.tweet_volume = data[i].tweet_volume;
        }

        obj.country = country;
        obj.woeid = id;
        if (!present) {
          insertingData.push(obj);
        }
      }
      await TwitterTrend.insertMany(insertingData);
      console.log("insert done");
    }
  }
};
