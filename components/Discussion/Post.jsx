import { useState } from "react";
import { db } from "../../lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function Post({ post, user }) {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "discussions", post.id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "discussions", post.id), {
        title: editedTitle,
        content: editedContent,
      });
      setEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {editing ? (
          <>
            <input
              className="form-control mb-2"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
            />
            <button className="btn btn-success me-2" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.content}</p>
            <p className="text-muted" style={{ fontSize: "0.8rem" }}>
              Posted on {post.createdAt?.toDate().toLocaleString() || "..."}
            </p>

            {user?.title === "professor" && (
              <>
                <button className="btn btn-warning me-2" onClick={() => setEditing(true)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </>
        )}

        {/* Student/any user can respond below */}
        <hr />
        <CommentList postId={post.id} />
        <CommentForm postId={post.id} user={user} />
      </div>
    </div>
  );
}
