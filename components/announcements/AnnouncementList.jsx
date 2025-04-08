import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const AnnouncementList = ({ announcements, user, onDelete }) => (
  <div className="announcement-list">
    {announcements.map((announcement) => (
      <Card key={announcement.id} className="secondary-card my-3">
        <Card.Body>
          <Card.Text>{announcement.content}</Card.Text>
          <Card.Footer className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Posted by {announcement.postedBy} on{" "}
              {new Date(announcement.postedAt).toLocaleString()}
            </small>
            {user?.title === "professor" && (
              <Button
                variant="danger"
                size="sm"
                className="custom-delete-btn"
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
    ))}
  </div>
);

export default AnnouncementList;
