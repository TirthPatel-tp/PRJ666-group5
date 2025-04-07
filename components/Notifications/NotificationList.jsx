import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Collapse, Button, Card } from "react-bootstrap";

const NotificationList = ({ courseId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("courseId", "==", courseId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [courseId]);

  return (
    <div>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="notification-collapse"
        aria-expanded={open}
        variant="primary"
        size="sm"
        className="m-2 custom-button"
      >
        {open ? "Hide Notifications" : "Show Notifications"}
      </Button>
      <Collapse in={open}>
        <div id="notification-collapse">
          <h4>Notifications</h4>
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <Card key={note.id} className="mb-2">
                <Card.Body>
                  <Card.Title>{note.title}</Card.Title>
                  <Card.Text>{note.message}</Card.Text>
                  <small>
                    {note.createdAt && note.createdAt.seconds
                      ? new Date(note.createdAt.seconds * 1000).toLocaleString()
                      : "Just now"}
                  </small>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No notifications.</p>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default NotificationList;
