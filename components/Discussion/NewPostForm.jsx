import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewPostForm({ courseId }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill in all fields.");

    try {
      await addDoc(collection(db, "discussions"), {
        title,
        content,
        courseId,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setContent("");
      console.log("✅ Post created successfully!");
    } catch (error) {
      console.error("❌ Error adding post:", error);
      alert("Failed to create discussion post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>Create a New Discussion Post</h4>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-control mb-2"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="form-control mb-2"
        rows={4}
      ></textarea>
      <button type="submit" className="btn btn-primary">
        Post
      </button>
    </form>
  );
}