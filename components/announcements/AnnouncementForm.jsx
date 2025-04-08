import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { app } from "../../lib/firebase";

const db = getFirestore(app);

export default function AnnouncementForm({ courseId }) {
  const { user } = useUser();
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) {
      alert("Please enter an announcement");
      return;
    }

    if (user?.title !== "professor") {
      setMessage("Only professors can post announcements.");
      return;
    }

    setLoading(true);
    try {
      const newAnnouncement = {
        courseId,
        content: announcement,
        postedAt: new Date().toISOString(),
        postedBy: user.email,
      };
      await addDoc(collection(db, "announcements"), newAnnouncement);
      setAnnouncement("");
      setMessage("Announcement posted successfully!");
    } catch (error) {
      console.error("Error posting announcement:", error);
      setMessage("Failed to post announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="my-3 secondary-card">
      <Card.Body>
        <Card.Title>Post New Announcement</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Enter your announcement here"
              disabled={loading}
            />
          </Form.Group>
          <Button className="custom-button" type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Announcement"}
          </Button>
          {message && (
            <div
              className={
                message.includes("Failed") ? "text-danger" : "text-success"
              }
            >
              {message}
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}
