import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Post from "./Post";

export default function DiscussionList({ courseId, user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!courseId) return;

    const q = query(
      collection(db, "discussions"),
      where("courseId", "==", courseId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(newPosts);
    });

    return () => unsubscribe();
  }, [courseId]);

  const handleEdit = async (id, updatedFields) => {
    try {
      const docRef = doc(db, "discussions", id);
      await updateDoc(docRef, updatedFields);
    } catch (err) {
      console.error("❌ Failed to update post:", err);
      alert("Failed to update post.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "discussions", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("❌ Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="discussion-list">
      {posts.length === 0 ? (
        <p>No discussions yet.</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            user={user}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
