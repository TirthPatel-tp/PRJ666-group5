import React from "react";
import { useRouter } from "next/router";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import HideToggleIcon from "../common/HideToggleIcon";

const QuizCard = ({ quiz, user, courseId, handleToggleVisibility }) => {
  const router = useRouter();

  return (
    <Card className="secondary-card my-2">
      <Card.Body>
        <div className="quizCardBody">
          <div className="cardHeader">
            <Card.Title>{quiz.title}</Card.Title>
            {user?.title === "professor" && (
              <HideToggleIcon
                id={quiz.id}
                initialVisible={quiz.visible}
                collection="quizzes"
                onToggle={handleToggleVisibility} // Pass the callback function
              />
            )}
          </div>
          {quiz.visible || user?.title === "professor" ? (
            <>
              <Button
                variant="link"
                onClick={() =>
                  router.push(`/courses/${courseId}/quizzes/${quiz.id}`)
                }
              >
                {user?.title === "professor" ? "Edit Quiz" : "Take Quiz"}
              </Button>
            </>
          ) : (
            <p>
              <i>Hidden from students</i>
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuizCard;
