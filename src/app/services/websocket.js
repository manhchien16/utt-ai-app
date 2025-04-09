const WebSocket = require("ws");
const messageCollection = require("../models/message");
const conversationCollection = require("../models/conversation");

const PORT = process.env.SOCKET_PORT;

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (data) => {
      const message = JSON.parse(data);
      console.log("Received:", message);

      const conversation = conversationCollection.findOne({
        particepants: { $all: [data.userId, data.userSendId] },
      });

      console.log(conversation);

      const newMessage = new messageCollection({
        conversationId: message.conversationId,
        senderId: message.userId,
        content: message.content,
        messageType: ["text"],
        sendBy: message.userSendId,
      });
      await newMessage.save();

      //   await conversationCollection.findByIdAndUpdate(message.conversationId, {
      //     lastMessage: {
      //       senderId: message.userSendId,
      //       content: message.content,
      //       timestamp: new Date(),
      //     },
      //   });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newMessage));
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  server.listen(PORT, () => {
    console.log("Server socket running on port 8081");
  });

  console.log("WebSocket server initialized");
  return wss;
};

module.exports = setupWebSocket;
