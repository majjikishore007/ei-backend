  
const router = require('express').Router();
const transporter  = require('../config/mail-setup'); 
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const maildata = require('../config/mail-data');
const authCheck = require('../middleware/check-auth');



router.get('/', authCheck, (req, res) => {
    User.findById(req.userData.userId)
        .exec()
        .then(result => {
            res.json({status: true, user : result});
        })
        .catch(err => {
            res.json({status: false, error: err});
        })
    
    
});


router.patch('/', authCheck,  (req, res) => {
    console.log(req.body);
    User.update({_id: req.userData.userId}, {$set: req.body})
        .exec()
        .then(result => {
            console.log(result);
            res.json({success: true, code: 200, message: 'User details updated'});
        })
        .catch(err => {
            res.json({success: false, code: 500, message: err.message});
        });
});

router.post('/reset', (req, res) => {
    const token  =  req.body.email.split('@')[0] +  Date.now(); 
    User.findOneAndUpdate({email: req.body.email}, {$set : {token: token}})
        .exec()
        .then(result => {
             if(!result) {
               return   res.json({success: false, message: "user not found"});
             } 
            const mailOption = {
                from: maildata.resetMail.form,
                to : result.email,
                subject: maildata.resetMail.subject,
                html : "<p>Hello " + result.displayName + "</p>" + maildata.resetMail.body[0] +
                 "<p><a href='https://extrainsights.in/recovery/" +req.body.email+  "/"+ token+ "'>Reset Passowrd Link</a></p>" + 
                 maildata.resetMail.body[1] + 
                 "<p><a href='https://extrainsights.in/recovery/" +req.body.email+  "/"+ token  +"'>https://extrainsights.in/recovery/"+req.body.email+"/"+token+"</a></p>" 
                + maildata.resetMail.body[2]
            };
            transporter.sendMail(mailOption, (error, info) => {
                if(error) {
                   return res.json(error);
                }
                return res.json({success: true, message: 'mail sent'});

            })
        })
        .catch(err => {
            res.json(err);
        })
       
});

router.patch('/reset', (req, res) => {
    
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err) {
            res.json({success: false, error: 'Password hashing error'});
        }else {
            // User.findOneAndUpdate({$and : [{email: req.body.email, token: req.body.token}]}, {$set: {password: hash}})
            //     .exec()
            //     .then(result => {
            //         console.log(result);
            //         res.json({success: true, message: 'Password reset successfully' });
            //     })
            //     .catch(error => {
            //         res.json({success:  false, error: 'Password has not been reset, Try Again' })
            //     })
            res.json(hash);
        }
    })
    
});

router.get('/alluser', (req, res) => {
    User.find()
        .sort('-_id')
        .select('displayName email')
        .exec()
        .then(result => {
           res.json({success: true,count: result.length, result: result});
        })
        .catch(err => {
            res.json({success: false, result: result});
        });
})

router.get('/logout', (req, res) => {
    console.log("logout");
    req.logout();
    req.session.destroy(err => {
        console.log("session has been destroyed");
    });

    res.json({success: true, message: 'logout successfully'});
});

router.get('/count/user', (req, res) => {
    User.countDocuments({})
        .exec()
        .then(result => {
            res.json({success : true, count : result})
        })
        .catch(err => {
            res.json({success: false, error: err});
        })
 })
 
 router.get('/userTokenData', authCheck, (req, res) => {
 
      res.json({success : true, user: req.userData})
 });
      
 router.get('/checkMailExisting/:email', (req, res) => {
     const email  = req.params.email;
     User.countDocuments({email: email})
         .exec()
         .then(result => {
             if (result > 0 ) {
                 res.json({success : true})
             }else {
                 res.json({success : false})
             }
         })
         .catch(err => {
             res.json({success : false})
         })
 })

router.patch('/changePassword', authCheck, (req, res) => {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err) {
            res.json({success : false, error: "Hasing error"})
        }else {
            const data = {
                displayName : req.body.displayName,
                phone : req.body.phone,
                password : hash,
                role:{subscriber: true, author:false, admin:false},
            }
            User.updateOne({_id: req.userData.userId}, {$set: data})
                .exec()
                .then(result => {
                    res.json({success : true, message: "Password has been chnaged"})
                })
                .catch(err => {
                    res.json({success : false, error: "mongo error"})
                })
               
        }

    });
}) 

module.exports = router;