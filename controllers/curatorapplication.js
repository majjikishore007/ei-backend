const CuratorApplication = require("../models/curator-applications");


exports.ApplyForCurator = async (req, res, next) => {
    try {
        let present = await CuratorApplication.findOne({name:req.body.name, email:req.body.email});
        if(present){
            return res.status(200).json({success:false, message:"You have already Applied.We will get Back to you soon"})
        }
        let application = {
            name: req.body.name,
            email: req.body.email,
            fbLink:req.body.fbLink,
            twitterLink:req.body.twitterLink,
            linkedinLink:req.body.linkedinLink,
            mediumLink:req.body.mediumLink,
            websiteLink:req.body.websiteLink,
            articleLink: req.body.articleLink,
            description: req.body.description,
        }

        await new CuratorApplication(application).save();
        res
          .status(200)
          .json({ success: true, message:"Application Saved Successfully. We will get Back to you soon" });
     
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
};


exports.getAllCuratorApplicationPagination = async (req, res, next) => {
  try {
      let page = parseInt(req.params.page);
      let limit = parseInt(req.params.limit);
      let applications = await CuratorApplication.find().sort({_id:-1}).skip(page * limit).limit(limit);
   
    if (applications.length >= 0) {
      res
        .status(200)
        .json({ success: true, count: applications.length, data: applications });
    } else {
      res.status(200).json({ success: false, message: "No entries found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};