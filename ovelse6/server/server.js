const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require('axios');

const app = express();
const customerRoute = require("./routes/customer");
const storeRoutes = require("./routes/store");

const http = require("http").Server(app);
const io = require("socket.io")(http);

const chatLog = require("./db/chat.js");

// Middlewares

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// Send client files from server

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/chat.html"));
});

app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/store.html"));
});

// app.get("/chatlog", (req, res) => {
//   res.send(chatLog);
// });

// API

app.use("/customer", customerRoute);
app.use("/store", storeRoutes);

// Start server


// Socket IO

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    chatLog.push(msg);
    console.log(chatLog);
  });
  socket.on("user joined", (username) => {
    console.log(username + " joined the chat");
    io.emit("chat message", username + " joined the chat");
  });
  socket.on("hola", (besked) => {
    console.log(besked);
    io.emit("hola", "besked tilbage til klienten..");
  });
});

http.listen(3000, '64.226.86.113', () => {
  console.log(`Server and Socket.IO running at http://64.226.86.113:3000/`);
});


app.get('/get-weather', async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&hourly=temperature_2m"
    );

    console.log("API-respons:", response.data); // Legg til denne linjen for å logge responsen

    const temperatureData = response.data.hourly.temperature_2m;

    const temperature = temperatureData[0];

    if (temperature < 20) {
      res.json({ message: "Det er for koldt til drinks." });
    } else {
      res.json({ message: "Tilbyd kaffe." });
    }
  } catch (error) {
    console.error("Feil ved API-forespørsel:", error);
    res.status(500).json({ error: "Feil ved henting av værdata." });
  }
});
