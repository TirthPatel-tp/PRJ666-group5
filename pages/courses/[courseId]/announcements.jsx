import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../../context/UserContext";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../../../lib/firebase";
import { Card, ListGroup, Button } from "react-bootstrap";
import AnnouncementForm from "../../../components/announcements/AnnouncementForm";
import CourseLayout from "@/components/common/CourseLayout";

const db = getFirestore(app);

export default function CourseAnnouncements() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(() => {
    if (!courseId) {
      console.log("Course ID is undefined!");
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "announcements"),
      where("courseId", "==", courseId),
      orderBy("postedAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [courseId]);

  useEffect(() => {
    const unsubscribe = fetchAnnouncements();
    return unsubscribe;
  }, [fetchAnnouncements]);

  if (loading) {
    return <p>Loading announcements...</p>;
  }

  return (
    <CourseLayout courseId={courseId}>
      <div>
        <h1 className="course-page-header">Announcements</h1>
        {user?.title === "professor" && (
          <AnnouncementForm courseId={courseId} />
        )}
        <Card className="secondary-card my-3">
          <Card.Body>
            <h5>Announcement History</h5>
            {announcements.length > 0 ? (
              <ListGroup>
                {announcements.map((ann) => (
                  <ListGroup.Item key={ann.id} className="highlight">
                    <p>{ann.content}</p>
                    <small>
                      Posted by {ann.postedBy} on{" "}
                      {new Date(ann.postedAt).toLocaleString()}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No announcements yet.</p>
            )}
          </Card.Body>
        </Card>
        <Button className="secondary-button" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </CourseLayout>
  );
}
