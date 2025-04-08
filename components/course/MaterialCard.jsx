import React from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import HideToggleIcon from "../common/HideToggleIcon";
import SubmissionCard from "./SubmissionCard";

const MaterialCard = ({
  material,
  user,
  handleSubmission,
  handleToggleVisibility,
  submissions,
  handleGradeSubmission,
}) => (
  console.log("MaterialCard", material),
  (
    <Card key={material.id} className="secondary-card my-2">
      <Card.Body>
        <div className="materialCardBody">
          <div className="cardHeader">
            <Card.Title>{material.name}</Card.Title>
            {user?.title === "professor" && (
              <HideToggleIcon
                id={material.id}
                initialVisible={material.visible}
                collection="course_materials"
                onToggle={handleToggleVisibility}
              />
            )}
          </div>
          {material.visible || user?.title === "professor" ? (
            <>
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="viewMaterialLink"
              >
                View Material
              </a>
              <br />
              <br />
              {user?.title === "student" && (
                <>
                  <h5>Submit Your Answer</h5>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleSubmission(material.id, file);
                      }
                    }}
                  />
                </>
              )}
              {submissions
                .filter((submission) => submission.materialId === material.id)
                .map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    user={user}
                    handleGradeSubmission={handleGradeSubmission}
                  />
                ))}
            </>
          ) : (
            <p>
              <i>Hidden from students</i>
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  )
);

export default MaterialCard;
