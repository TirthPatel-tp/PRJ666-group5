import { useState, useEffect, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../lib/firebase";

const db = getFirestore(app);

export const useAnnouncements = (courseId) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "announcements"),
        where("courseId", "==", courseId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchAnnouncements();
    }
  }, [courseId, fetchAnnouncements]);

  return { announcements, loading, fetchAnnouncements };
};
