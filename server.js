const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let bridge = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("update_bridge", bridge);

  socket.on("place_plank", (plank) => {
    bridge.push(plank);
    io.emit("update_bridge", bridge);
  });

  socket.on("chat", (msg) => {
    io.emit("chat", `Player ${socket.id.slice(0, 5)}: ${msg}`);
  });

  socket.on("game_over", () => {
    io.emit("game_over");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
