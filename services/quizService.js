import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "../lib/firebase";

const db = getFirestore(app);

export const createQuiz = async (courseId) => {
  try {
    const newQuiz = {
      title: "New Quiz",
      questions: [],
      courseId,
      visible: true,
    };
    const docRef = await addDoc(collection(db, "quizzes"), newQuiz);
    return { id: docRef.id, ...newQuiz };
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Failed to create quiz");
  }
};

export const getQuizzes = async (courseId) => {
  try {
    const q = query(
      collection(db, "quizzes"),
      where("courseId", "==", courseId)
    );
    const querySnapshot = await getDocs(q);
    const quizzes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  }
};
