import React from "react";

const ProgressBar = ({ answeredQuestions, totalQuestions }) => {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div
      className="progress-bar-container"
      style={{ width: "100%", height: "20px", margin: "20px 0" }}
    >
      <div
        className="progress-bar"
        style={{
          width: `${progressPercentage}%`,
          height: "100%",
          transition: "width 0.3s ease",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
