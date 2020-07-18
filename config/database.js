const crypto = require("crypto").randomBytes(256).toString("hex"); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
  uri:
    "mongodb+srv://extratechology:A33VkCNhdSKNFOtr@extraweb-fxo9s.gcp.mongodb.net/amin-data", // Databse URI and database name
  // uri : 'mongodb://localhost:27017/extra-data',
  secret: "amide#14",
  db: "amin-data",
  pasword: "A33VkCNhdSKNFOtr",
  secret: "aminuddin",
  keys: {
    google: {
      clientID:
        "274602821029-uuff1plku8qou4rj5iv854sg9pp55836.apps.googleusercontent.com",
      clientSecret: "1sbzVg14M8HJZQ8UrscG1CUS",
      callbackURL: "/social/google/redirect",
    },
    facebook: {
      clientID: "2739396539519951",
      clientSecret: "c099e4b7e6e5fbbc08c3463d7a9f7b93",
      callbackURL: "/social/facebook/redirect",
    },
    linkedin: {
      clientID: "81s9kb8q4yth6c",
      clientSecret: "qUll0Xv3IsBgyuZS",
      callbackURL: "/social/linkedin/redirect",
    },
    razorpay: {
      keyId: "rzp_live_C3vPAnLPMp9lFf",
      keySecret: "0j3Mgx0lKFpYDVChqBo0wUyW",
    },
    storage: {
      CLOUD_BUCKET: "extra-insights-images",
    },
  },
};
