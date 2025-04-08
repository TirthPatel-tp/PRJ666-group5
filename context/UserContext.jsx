// ./context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "../lib/firebase"; // Adjust the import based on your Firebase setup

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "contacts", firebaseUser.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            email: firebaseUser.email,
            name: userData.name,
            school_id: userData.school_id,
            title: userData.title,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
