const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// fichiers statiques
app.use(express.static("public"));

// état du jeu
let buzzedPlayers = [];
let buzzLocked = false;

io.on("connection", (socket) => {
  console.log("Un joueur connecté");

  // envoyer l’état actuel au nouvel arrivant
  socket.emit("buzzUpdate", buzzedPlayers);

  socket.on("buzz", (playerName) => {
    if (buzzLocked) return;
    if (!playerName) return;

    buzzLocked = true;
    buzzedPlayers.push(playerName);

    io.emit("buzzUpdate", buzzedPlayers);
    console.log("Buzz reçu de :", playerName);
  });

  socket.on("reset", () => {
    buzzedPlayers = [];
    buzzLocked = false;
    io.emit("buzzUpdate", buzzedPlayers);
    console.log("Buzz reset par le DJ");
  });
});

server.listen(PORT, () => {
  console.log("Serveur blind test OK sur le port", PORT);
});
