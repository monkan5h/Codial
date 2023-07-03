module.exports.chatSockets = (socketServer) => {
  let io = require("socket.io")(socketServer);

  //Here 'connection' event is detected by observer (we emited 'connection' event from subscriber)
  io.on("connect", function (socket) {
    //This will send/emit acknoledgement about connection to subscriber
    // console.log(`New conncetion received :${socket.id}`);

    socket.on("disconnect", function () {
      // console.log("Socket disconnected ... !");
    });

    socket.on("join_room", function (data) {
      // console.log("joining req received", data);

      socket.join(data.chatroom); //If chatroom exist then join, otherwise create and join it.

      //Sending notification to others that I joined it
      io.in(data.chatroom).emit("user_joined", data); //io.in define which chatroom to emit
    });

    socket.on("send_msg", function (data) {
      io.in(data.chatroom).emit("receive_msg", data);
    });
  });
};
