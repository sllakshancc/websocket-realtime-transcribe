// App.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Buffer } from "buffer";

window.Buffer = Buffer;
const socket = io("http://localhost:3001");

function App() {
  const [transcript, setTranscript] = useState("");
  const [botReply, setBotReply] = useState("");




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
