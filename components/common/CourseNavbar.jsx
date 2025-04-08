import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../../lib/firebase";
import { useUser } from "../../context/UserContext";

const db = getFirestore(app);

export default function CourseNavbar({ courseName, courseId, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [courseLocked, setCourseLocked] = useState(false);
  const [courseExists, setCourseExists] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchCourseLockStatus = async () => {
      if (!courseId) return;

      try {
        const courseRef = doc(db, "courses", courseId);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          setCourseLocked(courseDoc.data().locked || false);
        } else {
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

  const handleLockCourse = async (locked) => {
    try {
      if (!courseExists) {
        alert("Error: Cannot lock/unlock a non-existent course.");
        return;
      }

      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, { locked });

      setCourseLocked(locked);
      alert(`Course ${locked ? "locked" : "unlocked"} successfully!`);
    } catch (error) {
      console.error("Error updating course lock status:", error);
      alert("Failed to update course lock status. Please try again.");
    }
  };

  const handleSelect = () => {
    setExpanded(false); // Collapse the navbar
  };

  if (!courseExists) {
    return <p style={{ color: "red" }}>Error: Course not found.</p>;
  }

  return (
    <Navbar
      expand="md"
      className="navbar-dark navbar-custom"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      style={{ borderRadius: "0.5rem" }}
    >
      <Container>
        <Link href={`/courses/${courseId}`} passHref legacyBehavior>
          <Navbar.Brand className="course-navbar-brand">
            {courseName}
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="course-navbar-nav" />
        <Navbar.Collapse id="course-navbar-nav">
          <Nav className="me-auto">
            <Link
              href="/courses/[courseId]/announcements"
              as={`/courses/${courseId}/announcements`}
              passHref
              legacyBehavior
            >
              <Nav.Link onClick={handleSelect}>Announcements</Nav.Link>
            </Link>
            <Link href="/grade" as={`/grade`} passHref legacyBehavior>
              <Nav.Link onClick={handleSelect}>Grades</Nav.Link>
            </Link>
            <Link
              href="/courses/[courseId]/quizzes"
              as={`/courses/${courseId}/quizzes`}
              passHref
              legacyBehavior
            >
              <Nav.Link onClick={handleSelect}>Quizzes</Nav.Link>
            </Link>
            <Nav.Link onClick={() => handleSelect("assignments")}>Assignments</Nav.Link>
            <Link
              href="/courses/[courseId]/discussions"
              as={`/courses/${courseId}/discussions`}
              passHref
              legacyBehavior
            >
              <Nav.Link onClick={handleSelect}>Discussions</Nav.Link>
            </Link>
          </Nav>
          {user?.title === "professor" && (
            <Button
              variant="outline-light"
              onClick={() => handleLockCourse(!courseLocked)}
              style={{ marginLeft: "10px" }}
            >
              {courseLocked ? "Unlock Course" : "Lock Course"}
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
