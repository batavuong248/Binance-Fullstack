Set-Content -Path .\server\index.js -Value @"
const express = require("express");
const WebSocket = require("ws");
const axios = require("axios");

const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

app.get("/api/price", async (req, res) => {
  const { data } = await axios.get(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
  );
  res.json({ price: data.price });
});

wss.on("connection", (ws) => {
  const binanceWS = new WebSocket(
    "wss://stream.binance.com:9443/ws/btcusdt@trade"
  );
  binanceWS.on("message", (msg) => ws.send(msg));
  ws.on("close", () => binanceWS.close());
});

server.listen(4000, () => console.log("Server listening on port 4000"));
"@
