import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUser } from "../../context/UserContext";

export default function CommentList({ postId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, "discussions", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetched);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await addDoc(collection(db, "discussions", postId, "comments"), {
        text: comment,
        author: user.name,
        createdAt: serverTimestamp(),
      });
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, "discussions", postId, "comments", commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="mt-3">
      <h6>Comments:</h6>
      {comments.map((c) => (
        <div key={c.id} className="mb-2">
          <strong>{c.author}:</strong> {c.text}
          {user?.title === "professor" && (
            <button
              onClick={() => handleDeleteComment(c.id)}
              className="btn btn-sm btn-danger ms-2"
            >
              Delete
            </button>
          )}
        </div>
      ))}
      <textarea
        className="form-control mt-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <button className="btn btn-primary mt-1" onClick={handleAddComment}>
        Add Comment
      </button>
    </div>
  );
}
