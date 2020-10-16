const User = require("../models/user");
const mongoose = require("mongoose");
const maildata = require("../config/mail-data");
const transpoter = require("../config/mail-setup");
var hbs = require("nodemailer-express-handlebars");
transpoter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: "./view/",
      layoutsDir: "./view/",
      defaultLayout: "index.hbs",
    },
    viewPath: "./view/",
    extName: ".hbs",
  })
);

/**
 * this function will called everyday at 11 AM and scanning the db about those users who will be expiring in next 2 days and send them email
 */
exports.sendExpireNotificationMail = async () => {
  let users = await User.find({
    expireDate: { $exists: true },
  }).sort({
    _id: -1,
  });
  for (let i = 0; i <= users.length - 1; i++) {
    /**if user is expiring in 2 days or today */
    let dt = new Date(users[i].expireDate.toString());
    leftDay = Math.round(
      (dt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (leftDay == 0 || leftDay == 1 || leftDay == 2) {
      /**it mean user will be xpired in next 2 days or 1 days or today
       * then send them a email to subscribe
       */

      let d = dt.getDate();
      let mn = dt.getMonth() + 1;
      let yr = dt.getFullYear();

      let option = {
        from: maildata.expiryEmail.from,
        to: users[i].email,
        subject: maildata.expiryEmail.subject,
        html: `
        <!DOCTYPE html>
          <html lang="en">

          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>We hope you are enjoying EXTRA! INSIGHTS</title>
              <link href="https://fonts.googleapis.com/css2?family=Biryani:wght@400&display=swap" rel="stylesheet" />
              <style>
                  body {
                      font-family: "Biryani", sans-serif;
                  }

                  .button {
                      width: 140px;
                      height: 45px;
                      font-family: "Roboto", sans-serif;
                      font-size: 11px;
                      text-transform: uppercase;
                      letter-spacing: 2.5px;
                      font-weight: 500;
                      color: #000;
                      background-color: #fff;
                      border: none;
                      border-radius: 45px;
                      box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
                      transition: all 0.3s ease 0s;
                      cursor: pointer;
                      outline: none;
                      margin-left: 4%;
                  }

                  .button:hover {
                      background-color: #2ee59d;
                      box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
                      color: #fff;
                      transform: translateY(-7px);
                  }
              </style>
          </head>

          <body>
              <img style="display: block; margin: auto; width: 90%"
                  src="https://storage.googleapis.com/extra-insights-images/1600855680478BlogBanner_SubscriptionAd.jpg"
                  alt="extra insights" />
              <div style="margin-left: 5%; margin-right: 5%">
                  <p>Hi ${users[i].displayName},</p>
                  <p>
                      I am Anuj Agarwal, Founder, EXTRA! INSIGHTS! I hope you are enjoying
                      EXTRA! INSIGHTS' curation and content on our <a
                          href="https://play.google.com/store/apps/details?id=xyz.extrainsights" target="_blank">App</a> and
                      <a href="https://extrainsights.in" target="_blank"> Website.</a> Our curators dig deep into
                      the
                      internet to
                      find the best content out there so that you can spend your time reading,
                      watching, listening and learning, not searching. We strive to be an
                      essential tool for you to gain more insights and understand the How &
                      Why behind every What.
                  </p>
                  <div style="padding-left: 40px">
                      <p>
                          Your 7 day trial shall expire on ${d}/${mn}/${yr}. To continue enjoying our
                          curation <strong>until 31st December 2020</strong>, please subscribe
                          to EXTRA! INSIGHTS, through a
                          <strong>one time payment of ₹50</strong>.
                      </p>
                      <form action="https://extrainsights.in/payment" target="_blank">
                          <button type="submit" style="
                        display: block;
                        margin: auto;
                        border: none;
                        border-spacing: 0;
                        border-radius: 25px;
                        height: 40px;
                        background-color: rgb(24, 168, 168);
                        color: white;
                        cursor: pointer;
                        outline: 0;
                      ">
                              &nbsp; &nbsp; &nbsp; Subscribe Now &nbsp; &nbsp;&nbsp;
                          </button>
                      </form>
                  </div>
                  <p>
                      We look forward to your continued association with EXTRA! INSIGHTS and
                      to keep building for you, A Newsfeed to Rely On!
                  </p>
                  <p>
                      Note: We charge our users a curation fee. Most of the content that we
                      curate is available for free on the internet on the respective
                      publication's website.
                  </p>
                  <p>Thanking You</p>
                  <p>
                      Anuj Agarwal Founder, <br />
                      EXTRA! INSIGHTS
                  </p>
              </div>
          </body>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
              integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
              crossorigin="anonymous"></script>

          </html>
        `,
      };
      transpoter.sendMail(option, (er, information) => {
        if (er) {
          console.log(er);
        } else {
          console.log("success");
        }
      });
    }
  }
};

/**call this function from payment successfull callback api route to send email after successfull payment
 * with paid user id
 */
exports.paymentAckMail = async (id) => {
  let user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });

  let d = new Date(user.expireDate.toString()).getDate();
  let mn = new Date(user.expireDate.toString()).getMonth() + 1;
  let yr = new Date(user.expireDate.toString()).getFullYear();

  let userName = user.displayName;
  let expireDate = d + "/" + mn + "/" + yr;

  let option = {
    from: maildata.paymentAcknowledgeEmail.from,
    to: user.email,
    subject: maildata.paymentAcknowledgeEmail.subject,
    html: `
      <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Thank you for subscribing to EXTRA! INSIGHTS</title>
            <link href="https://fonts.googleapis.com/css2?family=Biryani:wght@400&display=swap" rel="stylesheet" />
            <style>
                body {
                    font-family: "Biryani", sans-serif;
                }

                .button {
                    width: 140px;
                    height: 45px;
                    font-family: "Roboto", sans-serif;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 2.5px;
                    font-weight: 500;
                    color: #000;
                    background-color: #fff;
                    border: none;
                    border-radius: 45px;
                    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease 0s;
                    cursor: pointer;
                    outline: none;
                    margin-left: 4%;
                }

                .button:hover {
                    background-color: #2ee59d;
                    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
                    color: #fff;
                    transform: translateY(-7px);
                }
            </style>
        </head>

        <body>
            <img style="display: block; margin: auto; width: 90%"
                src="https://storage.googleapis.com/extra-insights-images/1600855680478BlogBanner_SubscriptionAd.jpg"
                alt="extra insights" />
            <div style="margin-left: 5%; margin-right: 5%">
                <p>Hi ${userName},</p>
                <p>I am Anuj Agarwal, Founder, EXTRA! INSIGHTS! Thank you for Subscribing to EXTRA! INSIGHTS. Your subscription
                    shall keep our curators looking for the most credible, in-dpth and reliable content for you and shall also
                    help the news media industry move away from the broken advertisement based business model towards a more
                    sustainable one.</p>
                <p>
                <p>I hope you are enjoying EXTRA! INSIGHTS' curation and content on our <a
                        href="https://play.google.com/store/apps/details?id=xyz.extrainsights" target="_blank">App</a> and
                     <a href="https://extrainsights.in" target="_blank">Website</a>. Our curators dig deep into
                    the internet to find the best content out there so that you can
                    spend your time reading, watching, listening and learning, not searching. We strive to be an essential tool
                    for you to gain more insights and understand the How & Why behind every What.</p>

                <p>Your subscription is valid till ${expireDate}.</p>
                <div style="padding-left: 40px">
                    <form action="https://extrainsights.in" target="_blank">
                        <button type="submit" style="
                      display: block;
                      margin: auto;
                      border: none;
                      border-spacing: 0;
                      border-radius: 25px;
                      height: 40px;
                      background-color: rgb(24, 168, 168);
                      color: white;
                      cursor: pointer;
                      outline:0;
                    ">
                            &nbsp; &nbsp; &nbsp; Continue to EXTRA! INSIGHTS &nbsp; &nbsp;&nbsp;
                        </button>
                    </form>
                </div>
                <p>
                    We look forward to your continued association with EXTRA! INSIGHTS and to keep building for you, A Newsfeed
                    to Rely On!
                </p>
                <p>
                    Note: We charge our users a curation fee. Most of the content that we curate is available for free on the
                    internet on the respective publication's website.
                </p>
                <p>Thanking You</p>
                <p>
                    Anuj Agarwal Founder, <br />
                    EXTRA! INSIGHTS
                </p>
            </div>
        </body>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
            crossorigin="anonymous"></script>

      </html>
    
    
    
    `,
  };
  transpoter.sendMail(option, (er, information) => {
    if (er) {
      console.log(er);
    } else {
      console.log("success");
    }
  });
};
