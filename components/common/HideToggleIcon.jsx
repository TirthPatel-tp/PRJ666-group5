import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "../../lib/firebase";

const db = getFirestore(app);

const HideToggleIcon = ({ id, initialVisible, collection, onToggle }) => {
  const [visible, setVisible] = useState(initialVisible);

  const toggleVisibility = async () => {
    try {
      const docRef = doc(db, collection, id);
      await updateDoc(docRef, { visible: !visible });
      setVisible(!visible);
      onToggle(id, !visible); // Call the callback function to update the state
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          fontStyle: "italic",
          marginRight: "5px",
          color: visible ? "#616ebe" : "#8995e6",
        }}
      >
        {visible ? "Visible" : "Hidden"}
      </span>
      <FontAwesomeIcon
        icon={visible ? faEye : faEyeSlash}
        onClick={toggleVisibility}
        style={{
          cursor: "pointer",
          color: visible ? "#616ebe" : "#8995e6",
        }}
      />
    </div>
  );
};

export default HideToggleIcon;
