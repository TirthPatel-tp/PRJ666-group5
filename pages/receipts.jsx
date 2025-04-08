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

  useEffect(() => {
    const loadCoursesAndSubmissions = async () => {
      try {
        const fetchedDBS501 = await fetchCourse("DBS501");
        const fetchedPRJ666 = await fetchCourse("PRJ666");

        const materialsDBS501 = await fetchMaterials(fetchedDBS501.id);
        const materialsPRJ666 = await fetchMaterials(fetchedPRJ666.id);

        const submissionsDBS501 = await fetchSubmissions(fetchedDBS501.id);
        const submissionsPRJ666 = await fetchSubmissions(fetchedPRJ666.id);

        setMaterials([...materialsDBS501, ...materialsPRJ666]);
        setSubmissions([...submissionsDBS501, ...submissionsPRJ666]);
      } catch (err) {
        console.error("Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesAndSubmissions();
  }, []);

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

  const formatSubmissionDate = (timestamp) => {
    if (!timestamp) return "No submission date available";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="messages-container">
      <h1 className="page-title">Course Receipts</h1>

      <div className="course-section">
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <h2 className="course-title">Course Name: {submission.courseId}</h2>
              <p className="student-email">Student Email: {submission.studentEmail}</p>
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

        .submission-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 0 10px rgba(56, 56, 56, 0.829);
        }

        .submission-card p,
        .submission-card h2 {
          font-size: 1.1rem;
          color: white;
          margin-bottom: 10px;
        }

        .no-submissions {
          text-align: center;
          color: rgba(255, 255, 255, 0.685);
          font-style: italic;
        }
    `}</style>

    </div>
  );
};

export default Receipts;
