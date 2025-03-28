const WebSocket = require("ws");

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

  server.listen(8081, () => {
    console.log("Server socket running on port 8081");
  });

  console.log("WebSocket server initialized");
  return wss;
};

module.exports = setupWebSocket;
