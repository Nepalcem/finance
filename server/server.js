const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");


const tickers = [
  "AAPL", // Apple
  "GOOGL", // Alphabet
  "MSFT", // Microsoft
  "AMZN", // Amazon
  "FB", // Facebook
  "TSLA", // Tesla
];
function randomValue(min = 0, max = 1, precision = 0) {
  const random = Math.random() * (max - min) + min;
  return random.toFixed(precision);
}

function utcDate() {
  const now = new Date();
  return new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
}

function getQuotes() {
  return tickers.map((ticker) => ({
    ticker,
    exchange: "NASDAQ",
    price: randomValue(100, 300, 2),
    change: randomValue(0, 200, 2),
    change_percent: randomValue(0, 1, 2),
    dividend: randomValue(0, 1, 2),
    yield: randomValue(0, 2, 2),
    last_trade_time: utcDate(),
  }));
}

function trackTickers(socket) {
  // every N seconds
  const timer = setInterval(function () {
    const quotes = getQuotes();
    socket.emit("quotes", quotes);
  }, TIME_INTERVAL);

  socket.on("disconnect", function () {
    clearInterval(timer);
  });
}


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


const PORT = process.env.PORT || 4000;
const TIME_INTERVAL = 5000; // 5 seconds


app.use(cors());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("Client connected");
  trackTickers(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Socket server is running on http://localhost:${PORT}`);
});
