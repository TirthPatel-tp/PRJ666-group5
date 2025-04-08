import React from "react";
import ProgressBar from "./ProgressBar";

const QuizFooterBar = ({
  timeLeft,
  onSubmit,
  answeredQuestions,
  totalQuestions,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px", // Adjust padding to match the page's content
        boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        margin: "0 auto", // Center the bar within the page
      }}
    >
      <div
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginLeft: "150px" }}
      >
        {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
        {timeLeft % 60}
      </div>
      <div style={{ flex: 1, margin: "0 20px" }}>
        <ProgressBar
          answeredQuestions={answeredQuestions}
          totalQuestions={totalQuestions}
        />
      </div>
      <button
        onClick={onSubmit}
        className="custom-button"
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem",
          cursor: "pointer",
          marginRight: "150px",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default QuizFooterBar;
