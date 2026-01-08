const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let buzzList = [];
let buzzedPlayers = [];

io.on("connection", (socket) => {
  console.log("Un client connecté");

  // 🔁 Synchronisation à la connexion
  socket.emit("buzzUpdate", buzzList);

  // 🔴 Buzz
  socket.on("buzz", (name) => {
    if (buzzedPlayers.includes(name)) {
      return; // 🚫 déjà buzzé
    }

    buzzedPlayers.push(name);
    buzzList.push(name);

    io.emit("buzzUpdate", buzzList);
  });

  // 🔁 RESET DJ
  socket.on("reset", () => {
    buzzList = [];
    buzzedPlayers = [];
    io.emit("buzzUpdate", buzzList);
  });
});

http.listen(3000, () => {
  console.log("Serveur blind test OK");
});
