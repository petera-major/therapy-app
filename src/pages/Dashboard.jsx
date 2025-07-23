import React, { useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [userInput, setUserInput] = useState("");
  const [botReply, setBotReply] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const recognition =
    new window.webkitSpeechRecognition() || new window.SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  const startListening = () => {
    setIsListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setUserInput(spokenText);
      recognition.stop();
      setIsListening(false);
      await sendToBot(spokenText);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      recognition.stop();
      setIsListening(false);
    };
  };

  const sendToBot = async (message) => {
    if (!message.trim()) return;
    setIsLoading(true);
    setBotReply("");

    try {
      const res = await fetch(
        "https://therapy-backend-production.up.railway.app/respond",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();
      if (data.reply) {
        setBotReply(data.reply);
        speakResponse(data.reply);
      } else {
        alert("Therapist couldn't respond right now ");
      }
    } catch (err) {
      console.error("Error contacting bot:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendToBot(userInput);
  };

  return (
    <div className="therapist-container">
      <h1>TheraBot</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Type how you're feeling..."
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={{
            width: "80%",
            padding: "1rem",
            fontSize: "1rem",
            borderRadius: "8px",
          }}
        />
        <br />
        <button type="submit" disabled={isLoading || !userInput.trim()}>
          Send
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={startListening} disabled={isListening}>
          {isListening ? "Listening..." : "🎙️ Speak Instead"}
        </button>
      </div>

      {isLoading && (
        <div style={{ marginTop: "2rem" }}>
          <p>Therapist is preparing your reply...</p>
          <img src="/loading-bot.gif" alt="Loading" width="120" />
        </div>
      )}

      {botReply && (
        <div style={{ marginTop: "2rem" }}>
          <h3> Therapist’s Response:</h3>
          <p style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
            {botReply}
          </p>
          <img
            src="/talking-bot.gif"
            alt="Bot talking"
            width="100"
            style={{ marginTop: "1rem" }}
          />
        </div>
      )}
    </div>
  );
}

