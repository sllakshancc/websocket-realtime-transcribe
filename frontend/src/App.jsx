// App.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Buffer } from "buffer";

window.Buffer = Buffer;
const socket = io("http://localhost:3001");

function App() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [botReply, setBotReply] = useState("");
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const processorRef = useRef(null);

  useEffect(() => {
    socket.on("transcript", ({ text, isFinal }) => {
      setTranscript((prev) => (isFinal ? prev + text + " " : prev));
    });

    socket.on("bot-response", ({ text, audioData }) => {
      setBotReply(text);
      const audio = new Audio("data:audio/mp3;base64," + audioData);
      audio.play();
    });
  }, []);



  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">🎙️ AI Voice Chat</h1>
      <div>
        <h2 className="font-semibold">🗣️ Transcript</h2>
        <p>{transcript}</p>
      </div>
      <div>
        <h2 className="font-semibold">🤖 AI Reply</h2>
        <p>{botReply}</p>
      </div>
    </div>
  );
}

export default App;
