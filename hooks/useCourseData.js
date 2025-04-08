import { useState, useEffect } from "react";
import {
  fetchCourse,
  fetchMaterials,
  fetchSubmissions,
} from "../lib/firebaseUtils";

export const useCourseData = (courseId) => {
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      const fetchData = async () => {
        try {
          const courseData = await fetchCourse(courseId);
          const materialsData = await fetchMaterials(courseId);
          const submissionsData = await fetchSubmissions(courseId);
          setCourse(courseData);
          setMaterials(materialsData);
          setSubmissions(submissionsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [courseId]);

  return { course, materials, submissions, loading };
};
