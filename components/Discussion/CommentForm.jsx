import { useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export default function CommentForm({ postId, user }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, "discussions", postId, "comments"), {
        text,
        author: user?.name || user?.email || "Anonymous",
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Error posting comment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        className="form-control mb-2"
        placeholder="Write a comment..."
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="btn btn-outline-primary btn-sm">
        Add Comment
      </button>
    </form>
  );
}
