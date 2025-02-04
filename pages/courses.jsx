import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { Card, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebase"; // Import your Firebase configuration
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";
import PageHeader from "@/components/PageHeader";

const inter = Inter({ subsets: ["latin"] });

export default function Courses() {
  const router = useRouter();
  const { user } = useUser(); // Get the user object from the context
  const [page, setPage] = useState(1); // Pagination state
  const [userEmail, setUserEmail] = useState(""); // User's email state
  const [isSignedIn, setIsSignedIn] = useState(false); // Authentication state
  const auth = getAuth(app);

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

  // Function to handle the previous page button click
  const previous = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Static array of course objects --> *to be dynamically fetched from a database
  const courses = [
    {
      id: 1,
      title: "Course 1",
      description: "Description for Course 1",
      url: "/course1",
      locked: false,
    },
    {
      id: 2,
      title: "Course 2",
      description: "Description for Course 2",
      url: "/course2",
      locked: true,
    },
    // Add more courses as needed
  ];

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
                router.push(course.url)
              }
            >
              <MDBCardBody>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                {user?.title === "professor" ? (
                  <MDBBtn className="custom-button">
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
