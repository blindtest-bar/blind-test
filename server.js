const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// fichiers statiques (pages HTML)
app.use(express.static("public"));

// joueurs ayant buzzé
let buzzedPlayers = [];
let buzzLocked = false;

// réception d’un buzz
io.on("connection", (socket) => {
  console.log("Un joueur connecté");

  socket.on("buzz", (playerName) => {
    if (buzzLocked) return;

    buzzLocked = true;
    buzzedPlayers.push(playerName);

    io.emit("buzzed", buzzedPlayers);
    console.log("Buzz reçu de :", playerName);
  });

  socket.on("reset", () => {
    buzzedPlayers = [];
    buzzLocked = false;
    io.emit("reset");
    console.log("Buzz reset par le DJ");
  });
});

// lancement du serveur
server.listen(PORT, () => {
  console.log("Serveur blind test OK sur le port", PORT);
});
