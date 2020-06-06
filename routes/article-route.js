const router = require("express").Router();
const Article = require("../models/article");
const Publisher = require("../models/publisher");
const Rating = require("../models/rating");
const Comment = require("../models/comment");
const Viewarticle = require("../models/articleview");
const images = require("../config/cloud-storage-setup");
const Usernotification = require("../models/usernotification");
const Follow = require("../models/follow");
router.get('/', (req,res) => {
  Article.find().sort('-_id')
         .exec()
         .then(docs => {
             const response = {
                 count:docs.length,
                 artciles : docs.map(
                     doc => {
                         return {
                             title: doc.title,
                             description:  doc.description,
                             price: doc.price,
                             author: doc.author,
                             cover: doc.cover,
                             publisher: doc.publisher,
                             website: doc.website,
                             category: doc.category,
                             time: doc.time,
                             date:doc.publishingDate,
                             id: doc.id,
                             lan : doc.lan,
                             urlStr: doc.urlStr,
                             public : doc.public,
                             created_at: doc.created_at
                         };
                     }
                 )
             };
             if(docs.length >= 0) {
                 res.json(response);
             } else {
                 res.json({success: false, code: 404, message: "No entries found"});
             }
         })
         .catch(err => {
             console.log(err);
             res.json({ error: err });
         });

});
router.get('/topten', (req,res) => {
  Article.find().sort('-_id')
         .limit(10)
         .exec()
         .then(docs => {
             const response = {
                 count:docs.length,
                 artciles : docs.map(
                     doc => {
                         return {
                             title: doc.title,
                             description:  doc.description,
                             price: doc.price,
                             author: doc.author,
                             cover: doc.cover,
                             publisher: doc.publisher,
                             website: doc.website,
                             category: doc.category,
                             time: doc.time,
                             date:doc.publishingDate,
                             id: doc.id,
                             lan : doc.lan,
                             urlStr: doc.urlStr
                         };
                     }
                 )
             };
             if(docs.length >= 0) {
                 res.json(response);
             } else {
                 res.json({success: false, code: 404, message: "No entries found"});
             }
         })
         .catch(err => {
             console.log(err);
             res.json({ error: err });
         });

});

router.post('/admin', (req, res, next) => {
  const article = new Article({
      title:  req.body.title,
      description :  req.body.description,
      cover :  req.body.cover,
      price : req.body.price,
      author : req.body.author,
      publisher : req.body.publisher,
      time : req.body.time,
      website:  req.body.website,
      category: req.body.category,
      content : req.body.content,
      publishingDate: req.body.publishingDate,
      created_at: Date.now(),
      seo : {
          metaTitle: req.body.metaTitle,
          metaDescription : req.body.metaDescription,
          metaKeywords :  req.body.metaKeywords
        },
      urlStr : req.body.title.trim().replace(/[&\/\\#, +()$~%.'":;*?<>{}]+/ig, '-'),
      public : true

  });
  article.save()
         .then(result => {
             console.log(result);
             res.json({ success : true , code : 201, message : 'article has been submitted', result: result});
             
        
          })
         .catch(err => {
             console.log(err);

             res.json({success : false, code: 500, message : err});
         })
})
router.patch('/admin/:id', images.multer.single('cover'), images.sendUploadToGCS, (req, res) => {
  const id = req.params.id;
  data = {
      cover: req.file.cloudStoragePublicUrl
  }
  Article.findByIdAndUpdate(id, {$set : data})
         .exec()
         .then(result => {
             res.json({success: true, code: 200, result: result});

         })
         .catch(err => {
             res.json({success: false, code: 500, error:  err});
         })


})
router.post('/',  (req, res) => {
  const artcile = new Article({
      title: req.body.title,
      description : req.body.description,
      author: req.body.author,
      publisher: req.body.publisher,
      price: req.body.price,
      time: req.body.time,
      seo : {
        metaTitle: req.body.metaTitle,
        metaDescription : req.body.metaDescription,
        metaKeywords :  req.body.metaKeywords
      },
      publishingDate: req.body.publishingDate,
      created_at: Date.now(),
      lan: req.body.lan, 
      urlStr : req.body.title.trim().replace(/[&\/\\#=, +()$~%.'":;*?<>{}]+/ig, '-')
  });
  artcile.save()
         .then(result => {
             res.json({success : true, code: 201, result: result});
         })
         .catch(err => {
             res.json({success : false, code: 500, message: err});
         })
})

//update Image for article

router.get('/updateCoverImage/:id', images.multer.single('cover'), images.sendUploadToGCS, (req, res) => {
  const id = req.params.id;
  data = {
      cover: req.file.cloudStoragePublicUrl
  }
  Article.findByIdAndUpdate(id, {$set : data})
         .exec()
         .then(result => {
             res.json({success: true, code: 200, message: 'Image updated'});

         })
         .catch(err => {
             res.json({success: false, code: 500, error:  err});
         })
})

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Article.findById(id)
    .populate("publisher")
    .exec()
    .then((doc) => {
      if (doc) {
        res.json({ success: true, code: 200, artcile: doc });
      } else {
        res.json({ success: false, code: 404, message: "No valid entry" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, code: 500, message: err });
    });
});

router.get("/mobile/:id", (req, res) => {
  const id = req.params.id;
  Article.findById(id)
    .populate("publisher")
    .exec()
    .then((doc) => {
      if (doc) {
        const result = {
          title: doc.title,
          description:  doc.description,
          price: doc.price,
          author: doc.author,
          cover: doc.cover,
          publisher: doc.publisher,
          website: doc.website,
          category: doc.category,
          time: doc.time,
          date:doc.publishingDate,
          id: doc.id,
          lan : doc.lan,
          urlStr: doc.urlStr
        }
        return res.json({success: true, article: result});
      } else {
        res.json({ success: false, code: 404, message: "No valid entry" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, code: 500, message: err });
    });
});

router.get("/article/:title", (req, res) => {
  const urlStr = req.params.title;
  Article.findOne({ urlStr: urlStr })
    .populate("publisher")
    .exec()
    .then((result) => {
      if (!result) {
        return res.redirect("/api/article/" + urlStr);
      }
      const owner =
        result.publisher.userId == "5e5378b728d7f105839325b5" ? true : false;
      res.json({ success: true, code: 200, artcile: result, owner: owner });
    })
    .catch((err) => {
      res.json({ success: false, code: 404, message: "No valid entry" });
    });
});
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  Article.update({_id:id}, {$set: req.body})
         .exec()
         .then(result => {
             res.json({success: true, code: 200, result : result});
         })
         .catch(err => {
             console.log(err);
             res.json({success: false, code: 500, message: err});
         });
});

router.put("/:id", async (req, res, next) => {
  /*
    const id = req.params.id;
    Article.update({_id:id}, {$set: req.body})
           .exec()
           .then(result => {
               res.json({success: true, code: 200, result : result});
           })
           .catch(err => {
               console.log(err);
               res.json({success: false, code: 500, message: err});
           });
*/

  try {
    var article = await Article.findById(req.params.id).exec();
    article.set(req.body);
    var result = await article.save();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Article.remove({ _id: id })
    .exec()
    .then((result) => {
      res.json({ success: true, message: "Product deleted" });
    })
    .catch((err) => {
      res.json({ success: false, code: 500, message: err.name });
    });
});
router.get("/publisher/:id", (req, res) => {
  const id = req.params.id;
  Article.find({ publisher: id })
    .populate("publisher", "name")
    .exec()
    .then((result) => {
      res.json({ success: true, count: result.length, articles: result });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
    });
});

router.get("/noOfArticleForPublisher/:id", (req, res) => {
  const id = req.params.id;
  Article.find({ publisher: id })
    .exec()
    .then((result) => {
      res.json({ success: true, count: result.length });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
    });
});

// select article as category

router.get("/category/:paramp", async (req, res) => {
 
  const cat = req.params.paramp;
  var article;

  article = await Article.find({ category: new RegExp(cat, "i"), public: true })
    .sort("-_id")
    .populate("publisher")
    .exec();

  result = article.map((doc) => {
    return {
      title: doc.title,
      description: doc.description,
      price: doc.price,
      author: doc.author,
      cover: doc.cover,
      publisher: doc.publisher,
      website: doc.website,
      category: doc.category,
      time: doc.time,
      date: doc.publishingDate,
      id: doc.id,
      lan: doc.lan,
      urlStr: doc.urlStr,
      public: doc.public,
      seo: doc.seo,
      publisherId: doc.publisher.id
    };
  });

  
  res.json({ success: true, articles: result });

});
router.get("/category-total/:paramp", (req, res) => {
  const cat = req.params.paramp;
  Article.find({ category: new RegExp(cat, "i") })
    .sort("-_id")
    .populate("publisher")
    .exec()
    .then((result) => {
      res.json({ success: true, articles: result });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
    });
});

router.get("/publisher/:id/category/:paramp", (req, res) => {
  const id = req.params.id;
  const cat = req.params.paramp;
  Article.find({ $and: [{ publisher: id, category: new RegExp(cat, "i") }] })
    .populate("publisher")
    .exec()
    .then((result) => {
      res.json({
        success: true,
        publisher: req.params.id,
        count: result.length,
        articles: result,
      });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
    });
});
router.get("/mobile/publisher/:id/category/:paramp", (req, res) => {
  const id = req.params.id;
  const cat = req.params.paramp;
  Article.find({ $and: [{ publisher: id, category: new RegExp(cat, "i") }] })
    .populate("publisher")
    .exec()
    .then((docs) => {
      const result = docs.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          price: doc.price,
          author: doc.author,
          cover: doc.cover,
          publisher: doc.publisher,
          website: doc.website,
          category: doc.category,
          time: doc.time,
          date: doc.publishingDate,
          id: doc.id,
          lan: doc.lan,
          urlStr: doc.urlStr,
          public: doc.public,
          seo: doc.seo,
          publisherId: doc.publisher.id
        };
      });
      res.json({
        success: true,
        publisher: req.params.id,
        count: result.length,
        articles: result,
      });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
    });
});

router.get("/restruture/:id", async (req, res) => {
  category = [
    "business",
    "culture",
    "education",
    "entertainment",
    "enviornment",
    "general",
    "health",
    "lostintheclutter",
    "opinion",
    "politics",
    "sports",
    "startup",
    "technology",
  ];
  // const id = req.params.id;
  //const cat = req.params.paramp;
  data = [];
  news = {};
  for (x of category) {
    article = await Article.find({ category: new RegExp(x, "i") }).exec();
    news = {
      cat: x,
      data: data.push(article),
    };
  }
  publist = await Publisher.find().select("_id").exec();

  await res.json({ success: true, data: news });
  console.log(publist);
});

router.get("/somthing/somthing", (req, res) => {
  // Article.find()
  //        .exec()
  //        .then(result => {
  //            for(var i=0;i<result.length; i++) {
  //                Article.findByIdAndUpdate(result[i]._id, {$set: {urlStr: result[i].title.trim().replace(/[&\/\\#=, +()$~%.'":;*?<>{}]+/ig, '-')}})
  //                       .exec()
  //                       .then(rr => {
  //                           console.log(rr);
  //                       })
  //            }
  //            ress.json(result);

  //        })
  //        .catch(err => {
  //            res.json(err);
  //        })

  Article.updateMany({}, { $set: { public: true } })
    .exec()
    .then((result) => {
      res.json({ success: true, data: result });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});


router.get("/comment&rating/:userId", async (req, res) => {
  const publisher = await Publisher.find({ userId: req.params.userId }).exec();
  const comment = await Comment.find().exec();
  const articleByuser = [];
  const articleWithcomments = [];
  const articefullDetails = [];
  for (x of publisher) {
    const data = {
      pubname: x.name,
      articles: await Article.find({ publisher: x._id })
        .sort("-_id")
        .select("title publisher urlStr")
        .exec(),
    };
    articleByuser.push(data);
  }

  for (x of articleByuser) {
    for (y of x.articles) {
      data = {
        article: y,
        comments: await Comment.find({ article: y._id }),
        ratings: await Rating.find({ article: y._id }).exec(),
      };
      articleWithcomments.push(data);
    }
  }

  for (x of articleWithcomments) {
    data = {
      artcile: x.article,
      comments: x.comments,
      ratings: x.ratings,
      views: await Viewarticle.find({ news: x.article._id })
        .sort("-_id")
        .populate("user", "displayName")
        .exec(),
    };
    await articefullDetails.push(data);
  }

  await res.json({ status: 200, data: articefullDetails });
});
router.get("/count/article", (req, res) => {
  Article.countDocuments({})
    .exec()
    .then((result) => {
      res.json({ success: true, count: result });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});


module.exports = router;
