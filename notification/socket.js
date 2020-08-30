const socket = require("socket.io");

const eventEmitter = require("./event-emitter");

module.exports = (server) => {
  const io = socket(server);
  let connectionCount = 0;

  io.on("connection", (socket) => {
    console.log("SocketIO.Connections: ", `${++connectionCount} connections`);

    socket.on("set-user", (data) => {
      socket.userId = data.userId;
    });

    eventEmitter.on("searching", (data) => {
      socket.emit("searching", data);
    });

    eventEmitter.on("comment-on-article", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("comment-on-article", data);
      }
    });

    eventEmitter.on("counter-comment-on-article", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("counter-comment-on-article", data);
      }
    });

    eventEmitter.on("upvote-comment-on-article", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("upvote-comment-on-article", data);
      }
    });

    eventEmitter.on("share-article", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("share-article", data);
      }
    });

    eventEmitter.on("comment-on-debate", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("comment-on-debate", data);
      }
    });

    eventEmitter.on("counter-comment-on-debate", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("counter-comment-on-debate", data);
      }
    });

    eventEmitter.on("follow-publisher", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("follow-publisher", data);
      }
    });

    eventEmitter.on("rate-article", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("rate-article", data);
      }
    });

    eventEmitter.on("upvote-comment-on-debate", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("upvote-comment-on-debate", data);
      }
    });

    eventEmitter.on("comment-on-blog", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("comment-on-blog", data);
      }
    });

    eventEmitter.on("upvote-comment-on-blog", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("upvote-comment-on-blog", data);
      }
    });

    eventEmitter.on("counter-comment-on-blog", (data) => {
      if (socket.userId && socket.userId == data.reciever) {
        socket.emit("counter-comment-on-blog", data);
      }
    });

    socket.on("disconnect", () => {
      console.log(
        "SocketIO.Disconnection",
        `${--connectionCount} connections.`
      );
    });
  });
};
