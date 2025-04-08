import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const AnnouncementCard = ({ announcement, user, onDelete }) => (
  <Card key={announcement.id} className="secondary-card my-2">
    <Card.Body>
      <Card.Text>{announcement.content}</Card.Text>
      <Card.Footer>
        <small className="text-muted">
          Posted by {announcement.postedBy} on{" "}
          {new Date(announcement.postedAt).toLocaleString()}
        </small>
        {user?.title === "professor" && (
          <Button
            variant="danger"
            size="sm"
            className="float-right"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete this announcement?"
                )
              ) {
                onDelete(announcement.id);
              }
            }}
          >
            Delete
          </Button>
        )}
      </Card.Footer>
    </Card.Body>
  </Card>
);

export default AnnouncementCard;
