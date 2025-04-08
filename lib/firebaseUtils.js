import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { app } from "./firebase";

const storage = getStorage(app);
const db = getFirestore(app);

export const fetchCourse = async (courseId) => {
  const courseDoc = await getDoc(doc(db, "courses", courseId));
  if (courseDoc.exists()) {
    return { id: courseDoc.id, ...courseDoc.data() };
  } else {
    throw new Error("Course not found");
  }
};

export const fetchMaterials = async (courseId) => {
  const q = query(
    collection(db, "course_materials"),
    where("courseId", "==", courseId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const fetchSubmissions = async (courseId) => {
  const q = query(
    collection(db, "submissions"),
    where("courseId", "==", courseId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const uploadFile = async (path, file) => {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export const addSubmission = async (submission) => {
  await addDoc(collection(db, "submissions"), submission);
};

export const updateSubmission = async (submissionId, data) => {
  const submissionRef = doc(db, "submissions", submissionId);
  await updateDoc(submissionRef, data);
};

export const addAssignment = async (assignment) => {
  await addDoc(collection(db, "course_materials"), assignment);
};
