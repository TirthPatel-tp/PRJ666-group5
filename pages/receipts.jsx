import React, { useState, useEffect } from "react";
import { fetchSubmissions } from "../lib/firebaseUtils"; 
import { fetchCourse } from "../lib/firebaseUtils"; 
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from "../lib/firebase"; 

const db = getFirestore(app);

const Receipts = () => {
  const [submissions, setSubmissions] = useState([]);
  const [materials, setMaterials] = useState([]);
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

        // Fetch materials (assignments) for both courses
        const materialsDBS501 = await fetchMaterials(fetchedDBS501.id);
        const materialsPRJ666 = await fetchMaterials(fetchedPRJ666.id);

        // Fetch submissions for both courses
        const submissionsDBS501 = await fetchSubmissions(fetchedDBS501.id);
        const submissionsPRJ666 = await fetchSubmissions(fetchedPRJ666.id);

        setMaterials([...materialsDBS501, ...materialsPRJ666]); // Merging materials for both courses
        setSubmissions([...submissionsDBS501, ...submissionsPRJ666]); // Merging submissions for both courses
      } catch (err) {
        console.error("Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesAndSubmissions();
  }, []); // Empty dependency array ensures it runs only once on mount

  const fetchMaterials = async (courseId) => {
    try {
      const q = query(collection(db, "materials"), where("courseId", "==", courseId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching materials:", error);
      return [];
    }
  };

  const fetchSubmissions = async (courseId) => {
    try {
      const q = query(collection(db, "submissions"), where("courseId", "==", courseId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return [];
    }
  };

  const openFeedbackModal = (feedback) => {
    setCurrentFeedback(feedback);
    setFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setCurrentFeedback("");
  };

  const formatSubmissionDate = (timestamp) => {
    if (!timestamp) {
      return "No submission date available";
    }

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(); // Format the date in a user-friendly format
  };

  return (
    <div className="messages-container">
      <h1 className="page-title">Course Receipts</h1>

      {/* Display all submissions for both courses */}
      <div className="course-section">
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <h2 className="course-title">Course Name: {submission.courseId}</h2>
              <p className="file-name">File Name: {submission.fileName}</p>
              <p className="submission-date">
                Submission Date: {formatSubmissionDate(submission.submittedAt)}
              </p>
              <p className="status">
                Status:{" "}
                {submission.grade ? `Graded - Grade: ${submission.grade}` : "Not Graded"}
              </p>
            </div>
          ))
        ) : (
          <div className="no-submissions">No submissions found for the selected courses.</div>
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
        .messages-container {
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
          font-size: 1.1rem; /* Adjusted to match the rest of the text */
          color: white;
          margin-bottom: 10px; /* Reduced gap between course name and file name */
        }

        .submission-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 0 10px rgba(56, 56, 56, 0.829);
        }

        .file-name,
        .submission-date,
        .status {
          font-size: 1.1rem;
          color: white;
          margin-bottom: 10px;
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
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          width: 400px;
        }

        .modal-title {
          font-size: 1.25rem;
          margin-bottom: 10px;
        }

        .modal-feedback {
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .custom-button {
          background-color: #586adb;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .custom-button:hover {
          background-color: #3d2aa9;
        }
      `}</style>
    </div>
  );
};

export default Receipts;
