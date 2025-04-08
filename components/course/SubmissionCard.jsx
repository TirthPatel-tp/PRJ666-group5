import React from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const SubmissionCard = ({ submission, user, handleGradeSubmission }) => (
  console.log("SubmissionCard", submission),
  (
    <Card key={submission.id} className="submissionCard">
      <Card.Body>
        <p>
          <strong>Submission:</strong> {submission.fileName}
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="downloadLink"
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>
        </p>
        {submission.grade && (
          <p className="highlight">
            <strong>Grade:</strong> {submission.grade}
          </p>
        )}
        {submission.feedback && (
          <p className="highlight">
            <strong>Feedback:</strong> {submission.feedback}
          </p>
        )}
        {user?.title === "professor" && (
          <div className="gradingSection">
            <h6>Grade Submission</h6>
            <input
              type="text"
              placeholder="Grade"
              className="gradeInput"
              onChange={(e) => (submission.grade = e.target.value)}
            />
            <textarea
              placeholder="Feedback"
              className="feedbackInput"
              onChange={(e) => (submission.feedback = e.target.value)}
            />
            <button
              className="custom-button"
              onClick={() =>
                handleGradeSubmission(
                  submission.id,
                  submission.grade,
                  submission.feedback
                )
              }
            >
              Submit Grade
            </button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
);

export default SubmissionCard;
