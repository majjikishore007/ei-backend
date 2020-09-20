const Playlist = require("../models/playlist");

const Article = require("../models/article");
const Publisher = require("../models/publisher");
const mongoose = require("mongoose");
const { secret } = require("../config/database");

/**for admin insertion updation deletion and fetch section */

exports.saveNewPlaylist = async (req, res, next) => {
  try {
    let playlist = {
      title: req.body.title,
      thumbnail: req.body.thumbnail,
      shortDescription: req.body.description,
      articles: req.body.articles,
      audio: req.body.audio,
      video: req.body.video,
    };
    
    const addedplalist = new Playlist(playlist);
    await addedplalist.save();
    res.status(201).json({ success: true, message: "Playlist saved" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error });
  }
};

exports.editPlaylistDetails = async (req, res, next) => {
  try {
    let playlistId = mongoose.Types.ObjectId(req.params.PlaylistId);
    
    await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
      },
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "playlist is Updated" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};



exports.deletePlaylist = async (req, res, next) => {
  try {
    let playlistId = mongoose.Types.ObjectId(req.params.PlaylistId);
    await Playlist.remove({ _id: playlistId });
    res
      .status(200)
      .json({ success: true, message: "playlist is deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


exports.getAllPlaylistData = async (req, res, next) => {
   try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let playlistcount = []
    let playlists = await Playlist.find()
        .sort({ _id: -1 })
        .populate({
         path: "articles",
         populate: {
           path: "publisher",
           model: "Publisher",
         },
       }).populate({
         path: "audio",
         populate: {
           path: "publisher",
           model: "Publisher",
         },
       }).populate({
         path: "video",
         populate: {
           path: "publisher",
           model: "Publisher",
         },
       })
       .skip(page * limit)
       .limit(limit);

      res.status(200).json({ success: true, count: playlists.length, data: playlists});
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
 };


exports.getSinglePlaylistData = async (req, res, next) => {
  try {
   let playlistId = mongoose.Types.ObjectId(req.params.PlaylistId);
   
    let playlist = await Playlist.find(
      {
        _id: playlistId,
      }
    ).populate({
      path: "articles",
      populate: {
        path: "publisher",
        model: "Publisher",
      },
    }).populate({
      path: "audio",
      populate: {
        path: "publisher",
        model: "Publisher",
      },
    }).populate({
      path: "video",
      populate: {
        path: "publisher",
        model: "Publisher",
      },
    })


    
   // let audiodata =  playlist[audio]
   // let videodata =  playlist[video]
    //let articledata =  playlist[articles]
  //  let finalarray = [...audiodata , ...videodata , ...articleData]
    //let finalarraylimitwise = finalarray.splice(req.params.skipvalue , req.params.limit)
    //let arraysuffled = finalarraylimitwise.sort(() => Math.random() - 0.5)
    let responseObj = {
      title : playlist.title ,
       thumbnail: playlist.thumbnail,
      shortDescription: playlist.shortDescription,
      articles : playlist.articles,
      audio : playlist.audio,
      video : playlist.video
    }

console.log(responseObj)

    res.status(200).json({ success: true, data: playlist  });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error });
  }
};

