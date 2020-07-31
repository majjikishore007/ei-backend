const { Storage } = require("@google-cloud/storage");
const config = require("./database");

const path = require("path"); // Used for manipulation with path
const fs = require("fs-extra");

const AUDIO_BUCKET = config.keys.storage.AUDIO_BUCKET;

const storage = new Storage({
  keyFilename: path.join(__dirname, "../extrainsights-43d045c8bed4.json"),
  projectId: "extrainsights",
});
const bucket = storage.bucket(AUDIO_BUCKET);

const uploadPath = path.join(__dirname, "fu/"); // Register the upload path
fs.ensureDir(uploadPath);

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${AUDIO_BUCKET}/${filename}`;
}

function sendUploadToGCS(req, res, next) {
  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on("file", function (fieldname, file, filename) {
    let updatedFilename = Date.now() + filename;

    // Create a write stream of the new file
    const fstream = fs.createWriteStream(
      path.join(uploadPath, updatedFilename)
    );
    // Pipe it trough
    file.pipe(fstream);

    // On finish of the upload
    fstream.on("close", async () => {
      let filepath = path.join(uploadPath, updatedFilename);
      try {
        await bucket.upload(filepath, {
          public: true,
          gzip: true,
          metadata: {
            cacheControl: "public, max-age=31536000",
          },
        });
        fs.unlinkSync(filepath);

        req.audioStoragePublicUrl = getPublicUrl(updatedFilename);
        next();
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          messge: "Audio can't upload due to server error",
        });
      }
    });
  });
}

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
};
