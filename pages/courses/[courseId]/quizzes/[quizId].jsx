import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../../../../lib/firebase";
import { useUser } from "../../../../context/UserContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import CourseLayout from "@/components/common/CourseLayout";
import ProgressBar from "../../../../components/common/ProgressBar"; // Update import path for ProgressBar
import QuizFooterBar from "../../../../components/common/QuizFooterBar"; // Import the QuizFooterBar component

const db = getFirestore(app);

const QuizPage = () => {
  const router = useRouter();
  const { courseId, quizId } = router.query;
  const { user } = useUser();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeUp, setTimeUp] = useState(false);
  const [grade, setGrade] = useState(null);
  const accommodations = user?.name === "Lian"; // Static declaration based on name
  const adjustedDuration = accommodations ? 300 * 1.5 : 300;
  const [timeLeft, setTimeLeft] = useState(adjustedDuration); // Initialize timeLeft state

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const docRef = doc(db, "quizzes", quizId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const quizData = docSnap.data();
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(null));
      } else {
        console.error("Quiz not found");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    if (field === "question") {
      newQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.split("-")[1], 10);
      newQuestions[index].options[optionIndex] = value;
    } else if (field === "correctOption") {
      newQuestions[index].correctOption = parseInt(value, 10);
    }
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { question: "", options: ["", "", "", ""], correctOption: 0 },
      ],
    });
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "quizzes", quizId);
      await updateDoc(docRef, { title: quiz.title, questions: quiz.questions });
      alert("Quiz saved successfully!");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    console.log("Updated answers:", newAnswers); // Debug log to ensure state updates
  };

  const handleSubmitQuiz = async () => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctOption) {
        score += 1;
      }
    });
    const grade = (score / quiz.questions.length) * 100;
    setGrade(grade);
    console.log("Quiz submitted with answers:", answers);
    console.log("Grade:", grade);
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    handleSubmitQuiz();
  };

  if (!quiz) {
    return <p>Loading quiz...</p>;
  }

  const answeredQuestions = answers.filter((answer) => answer !== null).length; // Count answered questions
  const totalQuestions = quiz.questions.length; // Total number of questions

  return (
    <CourseLayout courseId={courseId}>
      {/* <div style={{ maxWidth: "800px", margin: "0 auto" }}> */}
      {user?.title === "professor" ? (
        <form onSubmit={handleSaveQuiz}>
          <div>
            <label>
              <strong>Quiz Title:</strong>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                required
                style={{
                  display: "block",
                  borderRadius: "5px",
                  width: "100%",
                  marginBottom: "1rem",
                }}
              />
            </label>
          </div>
          {quiz.questions.map((q, index) => (
            <Card key={index} className="mb-3 secondary-card">
              <Card.Body>
                <label style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                  required
                  style={{
                    display: "block",
                    borderRadius: "5px",
                    width: "100%",
                    marginBottom: "1rem",
                  }}
                />
                {q.options.map((option, optionIndex) => (
                  <label key={optionIndex} style={{ display: "block" }}>
                    Option {optionIndex + 1}
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          `option-${optionIndex}`,
                          e.target.value
                        )
                      }
                      required
                      style={{
                        display: "block",
                        borderRadius: "5px",
                        width: "100%",
                        marginBottom: "1rem",
                      }}
                    />
                  </label>
                ))}
                <label>
                  Correct Option
                  <select
                    value={q.correctOption}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "correctOption",
                        e.target.value
                      )
                    }
                    required
                    className="custom-button"
                    style={{
                      display: "block",
                      width: "100%",
                      marginBottom: "1rem",
                    }}
                  >
                    {q.options.map((_, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        Option {optionIndex + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </Card.Body>
            </Card>
          ))}
          <Button
            type="button"
            onClick={handleAddQuestion}
            className="secondary-button"
            style={{ marginRight: "1rem" }}
          >
            Add Question
          </Button>
          <Button type="submit" className="secondary-button">
            Save Quiz
          </Button>
        </form>
      ) : (
        <>
          <h1>{quiz.title}</h1>
          {quiz.questions.map((q, index) => (
            <Card key={index} className="secondary-card mb-3">
              <Card.Body>
                <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  Question {index + 1}
                </p>
                <p>{q.question}</p>
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} style={{ marginBottom: "1rem" }}>
                    <input
                      type="radio"
                      style={{ marginRight: "0.5rem" }}
                      id={`option-${index}-${optionIndex}`}
                      name={`question-${index}`}
                      value={optionIndex}
                      checked={answers[index] === optionIndex}
                      onChange={(e) =>
                        handleAnswerChange(index, parseInt(e.target.value, 10))
                      }
                    />
                    <label htmlFor={`option-${index}-${optionIndex}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </Card.Body>
            </Card>
          ))}
          <QuizFooterBar
            timeLeft={timeLeft}
            onSubmit={handleSubmitQuiz}
            answeredQuestions={answeredQuestions}
            totalQuestions={totalQuestions}
          />
        </>
      )}
      {/* </div> */}
    </CourseLayout>
  );
};

export default QuizPage;
