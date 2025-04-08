import CourseNavbar from "./CourseNavbar";
import { useUser } from "../../context/UserContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../lib/firebase";
import { useState, useEffect } from "react";

const db = getFirestore(app);

const CourseLayout = ({ courseId, children }) => {
  const { user } = useUser();
  const [courseExists, setCourseExists] = useState(true);

  useEffect(() => {
    const fetchCourseLockStatus = async () => {
      if (!courseId) return;

      try {
        const courseRef = doc(db, "courses", courseId);
        const courseDoc = await getDoc(courseRef);

        if (!courseDoc.exists()) {
          console.warn(`Course with ID "${courseId}" not found.`);
          setCourseExists(false);
        }
      } catch (error) {
        console.error("Error fetching course lock status:", error);
        setCourseExists(false);
      }
    };

    fetchCourseLockStatus();
  }, [courseId]);

  if (!courseExists) {
    return <p style={{ color: "red" }}>Error: Course not found.</p>;
  }

  return (
    <div>
      <CourseNavbar courseName={courseId} courseId={courseId} />
      <div className="course-content">{children}</div>
    </div>
  );
};

export default CourseLayout;
