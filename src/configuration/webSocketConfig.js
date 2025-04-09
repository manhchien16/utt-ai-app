const WebSocket = require("ws");

const PORT = process.env.SOCKET_PORT;
const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log(`Received: ${message}`);
      ws.send(`Server received: ${message}`);
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
