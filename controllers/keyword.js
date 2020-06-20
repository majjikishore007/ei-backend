const Keyword = require("../models/keyword");
const Article = require("../models/article");

exports.saveKeywords = async (req, res, next) => {
  try {
    Article.find()
      .select("category")
      .exec()
      .then((result) => {
        category = result.map((doc) => {
          if (doc.category) {
            return {
              cat: addToDatabase(doc.category),
            };
          } else {
            return {
              cat: "undefined",
            };
          }
        });
        res.json(category);
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const addToDatabase = (str) => {
  const val = (str + "").split(",");
  for (i = 0; i < val.length; i++) {
    let kw = val[i] !== undefined ? val[i].trim() : "";
    if (kw) {
      const keyword = new Keyword({
        keyword: val[i].trim(),
      });
      keyword
        .save()
        .then((result) => {
          // console.log(result);
        })

        .catch((err) => {
          if (err.code === 11000) {
            if (val[i]) {
              Keyword.update(
                { keyword: val[i].trim() },
                { $inc: { count: 1 } }
              ).exec();
            }
          }
        });
    }
  }
  return "done";
};

exports.getAllKeywords = async (req, res, next) => {
  try {
    let keywords = await Keyword.find().sort({ _id: -1 });
    res.status(200).json({ success: true, data: keywords });
  } catch (error) {
    res.status(500).json({ error });
  }
};
