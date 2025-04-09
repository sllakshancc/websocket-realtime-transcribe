// server.js
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
const { SpeechClient } = require("@google-cloud/speech");
const textToSpeech = require("@google-cloud/text-to-speech");
const axios = require("axios");
const stream = require("stream");

const speechClient = new SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});



});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
