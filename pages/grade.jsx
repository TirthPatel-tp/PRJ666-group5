import React, { useState, useEffect } from "react";
import { fetchSubmissions } from "../lib/firebaseUtils"; // Assuming you have fetchSubmissions function
import { fetchCourse } from "../lib/firebaseUtils"; // Assuming you have fetchCourse function

const ViewGrades = () => {
  const [submissionsDBS501, setSubmissionsDBS501] = useState([]);
  const [submissionsPRJ666, setSubmissionsPRJ666] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");

  useEffect(() => {
    const loadCoursesAndSubmissions = async () => {
      try {
        // Fetch courses first (hardcoded course IDs)
        const fetchedDBS501 = await fetchCourse("DBS501");
        const fetchedPRJ666 = await fetchCourse("PRJ666");

        // Fetch submissions for both courses
        const submissionsDBS501 = await fetchSubmissions(fetchedDBS501.id);
        const submissionsPRJ666 = await fetchSubmissions(fetchedPRJ666.id);

        setSubmissionsDBS501(submissionsDBS501);
        setSubmissionsPRJ666(submissionsPRJ666);
      } catch (err) {
        console.error("Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesAndSubmissions();
  }, []); // Empty dependency array ensures it runs only once on mount

  const openFeedbackModal = (feedback) => {
    setCurrentFeedback(feedback);
    setFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setCurrentFeedback("");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="view-grades-container">
      <h1 className="page-title">View Grades</h1>

      {/* Course DBS501 */}
      <div className="course-section">
        <h2 className="course-title">Course: DBS501</h2>
        {submissionsDBS501.length > 0 ? (
          submissionsDBS501.map((submission) => (
            <div key={submission.id} className="submission-card">
              <p className="file-name">File Name: {submission.fileName}</p>
              <p className="grade">Grade: {submission.grade ? submission.grade : "Not graded yet"}</p>
              <div className="actions">
                <button
                  className="feedback-button"
                  onClick={() => openFeedbackModal(submission.feedback)}
                  disabled={!submission.feedback}
                >
                  View Feedback
                </button>
                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="view-submission-button">
                  View Submission
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-submissions">No submissions found for DBS501.</div>
        )}
      </div>

      {/* Course PRJ666 */}
      <div className="course-section">
        <h2 className="course-title">Course: PRJ666</h2>
        {submissionsPRJ666.length > 0 ? (
          submissionsPRJ666.map((submission) => (
            <div key={submission.id} className="submission-card">
              <p className="file-name">File Name: {submission.fileName}</p>
              <p className="grade">Grade: {submission.grade ? submission.grade : "Not graded yet"}</p>
              <div className="actions">
                <button
                  className="feedback-button"
                  onClick={() => openFeedbackModal(submission.feedback)}
                  disabled={!submission.feedback}
                >
                  View Feedback
                </button>
                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="view-submission-button">
                  View Submission
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-submissions">No submissions found for PRJ666.</div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content main-card">
            <h3 className="modal-title">Feedback</h3>
            <p className="modal-feedback">{currentFeedback || "No feedback available."}</p>
            <button className="custom-button" onClick={closeFeedbackModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS for the component */}
      <style jsx>{`
        .view-grades-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: white;
        }

        .course-section {
          margin-bottom: 40px;
        }

        .course-title {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 20px;
        }

        .submission-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 0 10px rgba(56, 56, 56, 0.829);
        }

        .file-name {
          font-size: 1.1rem;
          color: white;
          margin-bottom: 10px;
        }

        .grade {
          font-size: 1rem;
          color: white;
          margin-bottom: 15px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .feedback-button,
        .view-submission-button {
          padding: 10px 15px;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.3s ease;
        }

        .feedback-button {
          background-color: #586adb;
          color: white;
        }

        .feedback-button:disabled {
          background-color: #dab8ff75;
          cursor: not-allowed;
        }

        .view-submission-button {
          background-color: #28a745;
          color: white;
          text-decoration: none;
          text-align: center;
        }

        .feedback-button:hover {
          background-color: #3d2aa9;
        }

        .view-submission-button:hover {
          background-color: #218838;
        }

        .no-submissions {
          text-align: center;
          color: rgba(255, 255, 255, 0.685);
          font-style: italic;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: rgb(30, 35, 66);
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .modal-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: white;
        }

        .modal-feedback {
          font-size: 1rem;
          color: white;
          margin-bottom: 20px;
        }

        .custom-button {
          background-color: #586adb;
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .custom-button:hover {
          background-color: #3d2aa9;
        }

        .loading,
        .error {
          text-align: center;
          font-size: 1.2rem;
          margin-top: 50px;
          color: white;
        }

        .error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default ViewGrades;
