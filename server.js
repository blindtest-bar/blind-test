const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let buzzedPlayers = [];

io.on("connection", (socket) => {
  console.log("Connexion :", socket.id);

  // envoyer l'état actuel
  socket.emit("buzzUpdate", buzzedPlayers);

  socket.on("buzz", (playerName) => {
    if (!playerName) return;

    // empêche double buzz même prénom
    if (buzzedPlayers.includes(playerName)) return;

    buzzedPlayers.push(playerName);

    io.emit("buzzUpdate", buzzedPlayers);
    console.log("Buzz :", playerName);
  });

  socket.on("reset", () => {
    buzzedPlayers = [];
    io.emit("buzzUpdate", buzzedPlayers);
    console.log("RESET DJ");
  });
});

server.listen(PORT, () => {
  console.log("Serveur OK sur port", PORT);
});
