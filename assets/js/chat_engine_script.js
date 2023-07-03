class ChatEngine {
  constructor(chatBoxId, userEmail, userName, envIp) {
    this.chatbox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    this.userName = userName;

    //Initiate socket connection
    this.socket = io.connect(`http://${envIp}:5000`, {
      transports: ["websocket"],
    });
    //At very first emitting 'connection' event to  observer  (we cud have explicitly written io.emit.connect)

    if (this.userEmail) {
      this.connectionHandler();
    }
  }
  connectionHandler() {
    let self = this;

    //here 'on' detects an event 'connect'
    //Observer emited acknowledgement with 'connect' event
    this.socket.on("connect", function () {
      console.log("Connection established using sockets...!");

      //emitting/sending event or request with data to join chatroom
      self.socket.emit("join_room", {
        user_email: self.userEmail,
        user_name: self.userName,
        chatroom: "codial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("A user joined", data);
      });
    });

    //emiting 'send_msg' event click button and if message container is not empty
    $("#send-message").click(function () {
      let msg = $("#chat-message-input").val();
      if (msg != "") {
        self.socket.emit("send_msg", {
          message: msg,
          chatroom: "codial",
          user_email: self.userEmail,
          user_name: self.userName,
        });
      }
    });

    //emiting 'send_msg' event click button and if message container is not empty
    $("#share-location").click(function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          let pos = `<a href="https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}" target="_blank" style="font-family: Arial, Helvetica, sans-serif;">This is my location</a>`;
          self.socket.emit("send_msg", {
            message: pos,
            chatroom: "codial",
            user_email: self.userEmail,
            user_name: self.userName,
          });
        });
      } else {
        self.socket.emit("send_msg", {
          message: "Geolocation is not supported by this browser.",
          chatroom: "codial",
          user_email: self.userEmail,
          user_name: self.userName,
        });
      }

      // }
    });

    //Detecting 'receive_msg' event to receive msg from observer
    self.socket.on("receive_msg", function (data) {
      let messageType = "other-message";
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
      }

      let newMessge = `<li class="${messageType}"><span>${data.message}<br /><sub>${data.user_name}</sub></span></li>`;
      // newMessge.addClass(messageType);
      $("#chat-messages-list").append(newMessge);
      $("#chat-message-input").val("");
      $("#chat-messages-list").animate({ scrollTop: 20000000 }, "slow");
    });
  }
}
