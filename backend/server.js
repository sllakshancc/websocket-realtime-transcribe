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

  socket.on("start-recording", (config) => {
    recognizeStream = speechClient
      .streamingRecognize({
        config: {
          encoding: "LINEAR16",
          sampleRateHertz: 44100,
          languageCode: "en-US",
        },
        interimResults: true,
      })
      .on("error", (error) => {
        console.error("STT Error:", error);
      })
      .on("data", (data) => {
        const text = data.results[0]?.alternatives[0]?.transcript || "";
        console.log("STT text:" + text);
        const isFinal = data.results[0]?.isFinal;
        if (isFinal) finalTranscript += text + " ";
        socket.emit("transcript", { text, isFinal });
      })
      .on("end", () => {
        console.log("STT stream ended."); // Add this log
      })
      .on("close", () => {
        console.log("STT stream closed."); // Add this log
      });
  });

  socket.on("audio-chunk", (chunk) => {
    if (recognizeStream) {
      const buffer = Buffer.from(chunk, "base64");
      console.log("Received audio chunk size:", buffer.length);
      recognizeStream.write(buffer);
    }
  });

  socket.on("stop-recording", async () => {
    if (recognizeStream) recognizeStream.end();
    recognizeStream = null;

    try {
      // const aiResponse = await axios.post("https://your-ai-endpoint.com/chat", {
      //   prompt: finalTranscript.trim(),
      // });
      // const aiText = aiResponse.data.text || "Sorry, I didn't understand that.";

      const aiText = "This is a mock response from chatbot.";

      const [ttsResponse] = await ttsClient.synthesizeSpeech({
        input: { text: aiText },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" },
      });

      const audioBase64 = ttsResponse.audioContent.toString("base64");
      socket.emit("bot-response", { text: aiText, audioData: audioBase64 });
      finalTranscript = "";
    } catch (err) {
      console.error("AI/TTS Error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected");
    if (recognizeStream) recognizeStream.end();
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
