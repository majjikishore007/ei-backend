const router = require('express').Router();
const Parser = require('rss-parser');
const parser = new Parser();

router.post('/', (req, res) => {
    (async () => {
 
      let feed = await parser.parseURL(req.body.url);
       res.json({success: true, result: feed});
       
      })();
   
});

module.exports = router;