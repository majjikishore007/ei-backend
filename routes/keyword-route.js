const router = require('express').Router();
const chekAuth = require('../middleware/check-auth');
const Keyword = require('../models/keyword');
const Article = require('../models/article');

router.get('/', (req, res) => {
    Article.find()
           .select('category')
           .exec()
           .then(result => {
                 
               category = result.map(doc => {
                  
                       if(doc.category) {
                          return  {
                        cat:  addToDatabase(doc.category)
                           }

                       }else {
                        return  {
                            cat:  "undefined"
                               }
                       }
                   
                
               })
               res.json(category)
           })
})

function addToDatabase(str){
    const val = (str +"").split(',')
    for(i=0;i<val.length;i++) {
        const keyword = new Keyword({
            keyword : val[i].trim(),
        });
        keyword.save()
               .then(result => {
                   console.log(result);
               })
               .catch(err => {
                   if(err.code === 11000) {
                       Keyword.update({keyword: val[i].trim()}, {$inc: {count: 1}}).exec()
                   }
               });
    }
    return "done"
}


module.exports = router;