import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="overlay" />
      <div className="hero-content">
        <h1>TheraBot Therapea</h1>
        <p>Your personal Bot that's always here for you</p>

        <div className="video-container">
          <video src="/thera.mp4" autoPlay loop />
        </div>

        <div className="button-group">
          <button onClick={() => navigate("/dashboard")}>Enter Your Safe Space</button>
        </div>
      </div>

      <footer>
        <p>PeteraMajor © 2025</p>
      </footer>
    </div>
  );
}
