exports.validateOnsaveNewTimeline = async (req, res, next) => {
   if (!req.body.keyword) {
     return res
       .status(400)
       .json({ success: false, message: "Please provide main keyword" });
   }
   if (!req.body.timeline) {
     return res.status(400).json({
       success: false,
       message: "Please provide atleast one timeline date with info",
     });
   }
   if (req.body.timeline) {
     return req.body.timeline.forEach((element) => {
       if (!element.date) {
         return res
           .status(400)
           .json({ success: false, message: "Please provide timeline date" });
       }
       if (!element.shortDescription) {
         return res.status(400).json({
           success: false,
           message: "Please provide timeline short description",
         });
       }
     });
   }
   next();
 };