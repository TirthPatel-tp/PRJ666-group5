import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuizCard from "../../../../components/quizzes/QuizCard";
import { getQuizzes } from "../../../../services/quizService";
import { useUser } from "../../../../context/UserContext";
import CourseLayout from "@/components/common/CourseLayout";

const QuizzesPage = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (courseId) {
      fetchQuizzes();
    }
  }, [courseId]);

  const fetchQuizzes = async () => {
    const fetchedQuizzes = await getQuizzes(courseId);
    setQuizzes(fetchedQuizzes);
  };

  return (
    <CourseLayout courseId={courseId}>
      <h1>Quizzes</h1>
      <div>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} user={user} courseId={courseId} />
        ))}
      </div>
    </CourseLayout>
  );
};

export default QuizzesPage;
