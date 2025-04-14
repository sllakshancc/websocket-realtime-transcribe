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

io.on("connection", (socket) => {
  console.log("✅ User connected");
  let recognizeStream = null;
  let finalTranscript = "";


  socket.on("audio-chunk", (chunk) => {
    if (recognizeStream) {
      const buffer = Buffer.from(chunk, "base64");
      console.log("Received audio chunk size:", buffer.length);
      recognizeStream.write(buffer);
    }
  });


});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
