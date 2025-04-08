import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { Card, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useUser } from "../../context/UserContext"; // Import the useUser hook
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../lib/firebase"; // Import your Firebase configuration
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";

const inter = Inter({ subsets: ["latin"] });

export default function Courses() {
  const router = useRouter();
  const { user } = useUser(); // Get the user object from the context
  const [page, setPage] = useState(1); // Pagination state
  const [userEmail, setUserEmail] = useState(""); // User's email state
  const [isSignedIn, setIsSignedIn] = useState(false); // Authentication state
  const [courses, setCourses] = useState([]); // State to store courses
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setUserEmail(user.email);
      } else {
        setIsSignedIn(false);
        setUserEmail("");
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [auth]);

  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Courses:", data);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Function to handle the previous page button click
  const previous = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Function to toggle the lock status of a course
  const toggleLockStatus = async (courseId, currentStatus) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, {
        locked: !currentStatus,
      });
      // Update the local state to reflect the change
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, locked: !currentStatus }
            : course
        )
      );
    } catch (error) {
      console.error("Error updating course lock status:", error);
    }
  };

  return (
    <MDBContainer fluid style={{ height: "100vh" }}>
      <h1 className="page-header">Courses</h1>
      <MDBRow xs={1} md={2} className="g-4">
        {courses.map((course) => (
          <MDBCol key={course.id}>
            <MDBCard
              className={`main-card course-card ${
                course.locked && user?.title !== "professor"
                  ? "locked-card"
                  : ""
              }`}
              onClick={() =>
                (!course.locked || user?.title === "professor") &&
                router.push(`/courses/${course.id}`)
              }
            >
              <MDBCardBody>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                {user?.title === "professor" ? (
                  <MDBBtn
                    className="custom-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      toggleLockStatus(course.id, course.locked);
                    }}
                  >
                    {course.locked ? "Unlock Course" : "Lock Course"}
                  </MDBBtn>
                ) : (
                  <small>{course.locked ? "Course unavailable" : ""}</small>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </MDBContainer>
  );
}
