import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const AddAssignmentForm = ({
  newAssignment,
  setNewAssignment,
  handleAddAssignment,
}) => (
  <Card className="secondary-card my-3">
    <Card.Body>
      <Card.Title>Add New Assignment</Card.Title>
      <div className="assignmentForm">
        <input
          type="text"
          placeholder="Assignment Name"
          value={newAssignment.name}
          onChange={(e) =>
            setNewAssignment({
              ...newAssignment,
              name: e.target.value,
            })
          }
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setNewAssignment({ ...newAssignment, file });
            }
          }}
        />
        <label>
          <input
            type="checkbox"
            checked={newAssignment.visible}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                visible: e.target.checked,
              })
            }
          />
          &nbsp; Visible to Students
        </label>
        <Button className="custom-button" onClick={handleAddAssignment}>
          Add Assignment
        </Button>
        <Button
          variant="secondary"
          className="ml-2"
          onClick={() => setShowAssignmentForm(false)}
        >
          Cancel
        </Button>
      </div>
    </Card.Body>
  </Card>
);

export default AddAssignmentForm;
