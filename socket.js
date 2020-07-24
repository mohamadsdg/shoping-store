let io;
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer);
    return io;
  },
  getInstance: () => {
    if (!io) {
      throw new Error("Connection Not Stablish !!!");
    }
    return io;
  },
};
