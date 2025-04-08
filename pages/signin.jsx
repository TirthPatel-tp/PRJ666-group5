// ./api/signin.jsx
import { useUser } from "../context/UserContext";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { app, db } from "../lib/firebase";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";

const SignIn = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  // use effect to authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignedIn(true);
        const userDoc = await getDoc(doc(db, "contacts", user.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            email: user.email,
            name: userData.name,
            school_id: userData.school_id,
            title: userData.title,
          });
        }
      } else {
        setIsSignedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, setUser]);

  // const signIn = async (email, password) => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;
  //     setIsSignedIn(true);
  //     setUserEmail(user.email);
  //     await fetchUserData(user.email);
  //   } catch (error) {
  //     const errorCode = error.code;
  //     let errorMessage = "";

  //     // Custom error messages based on error codes
  //     if (errorCode === "auth/invalid-credential") {
  //       errorMessage = "You entered the wrong password";
  //     } else if (errorCode === "auth/user-not-found") {
  //       errorMessage = "No user found with this email";
  //     } else if (errorCode === "auth/too-many-requests") {
  //       errorMessage = "Too many attempts. Please try again later.";
  //     } else {
  //       errorMessage = "An error occurred. Please try again.";
  //     }

  //     setErrorMessage(errorMessage);
  //   }
  // };

  // const signIn = async (email, password) => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;
  //     setIsSignedIn(true);
  //     setUserEmail(user.email);
  //     // User state will be automatically set by the onAuthStateChanged listener in UserProvider
  //   } catch (error) {
  //     const errorCode = error.code;
  //     let errorMessage = "";

  //     if (errorCode === "auth/invalid-credential") {
  //       errorMessage = "You entered the wrong password";
  //     } else if (errorCode === "auth/user-not-found") {
  //       errorMessage = "No user found with this email";
  //     } else if (errorCode === "auth/too-many-requests") {
  //       errorMessage = "Too many attempts. Please try again later.";
  //     } else {
  //       errorMessage = "An error occurred. Please try again.";
  //     }

  //     setErrorMessage(errorMessage);
  //   }
  // };

  // const signIn = async (email, password) => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;
  //     setIsSignedIn(true);
  //     // User state will be automatically set by the onAuthStateChanged listener in UserProvider
  //   } catch (error) {
  //     const errorCode = error.code;
  //     let errorMessage = "";

  //     if (errorCode === "auth/invalid-credential") {
  //       errorMessage = "You entered the wrong password";
  //     } else if (errorCode === "auth/user-not-found") {
  //       errorMessage = "No user found with this email";
  //     } else if (errorCode === "auth/too-many-requests") {
  //       errorMessage = "Too many attempts. Please try again later.";
  //     } else {
  //       errorMessage = "An error occurred. Please try again.";
  //     }

  //     setErrorMessage(errorMessage);
  //   }
  // };

  // const signIn = async (email, password) => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;
  //     // User state will be automatically set by the onAuthStateChanged listener in UserProvider
  //     router.push("/"); // Redirect to home or another page after successful sign-in
  //   } catch (error) {
  //     const errorCode = error.code;
  //     let errorMessage = "";

  //     if (errorCode === "auth/invalid-credential") {
  //       errorMessage = "You entered the wrong password";
  //     } else if (errorCode === "auth/user-not-found") {
  //       errorMessage = "No user found with this email";
  //     } else if (errorCode === "auth/too-many-requests") {
  //       errorMessage = "Too many attempts. Please try again later.";
  //     } else {
  //       errorMessage = "An error occurred. Please try again.";
  //     }

  //     setErrorMessage(errorMessage);
  //   }
  // };

  // sign in user with email and password
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setIsSignedIn(true);
      // User state will be automatically set by the onAuthStateChanged listener in UserProvider
      router.push("/"); // Redirect to home or another page after successful sign-in
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = "";

      if (errorCode === "auth/invalid-credential") {
        errorMessage = "You entered the wrong password";
      } else if (errorCode === "auth/user-not-found") {
        errorMessage = "No user found with this email";
      } else if (errorCode === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      } else {
        errorMessage = "An error occurred. Please try again.";
      }

      setErrorMessage(errorMessage);
    }
  };

  // sign out user and return to signin page
  const handleLogout = async () => {
    await auth.signOut();
    setIsSignedIn(false);
    setUser(null);
    router.push("/signin");
  };

  // reset password
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("A password reset link has been sent to your email.");
    } catch (error) {
      setErrorMessage(
        "Failed to send password reset email. Please enter your email address."
      );
    }
  };

  const redirectToProfile = () => {
    router.push("/");
  };

  return (
    <div className="body">
      <MDBContainer fluid>
        {isSignedIn && user ? (
          <MDBCard className="main-card signin-card">
            <MDBCardBody className="text-center">
              <h1>Welcome, {user.name || user.email || user.school_id}!</h1>
              <p>
                {user.name} ({user.title}, School ID: {user.school_id})
              </p>
              <p>You have successfully signed in.</p>
              <MDBBtn className="custom-button" onClick={redirectToProfile}>
                Go to Profile
              </MDBBtn>
              <br />
              <br />
              <MDBBtn className="custom-button" onClick={handleLogout}>
                Logout
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        ) : (
          <MDBRow className="g-0 d-flex justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard className="main-card signin-card">
                <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your login and password!
                  </p>
                  <form
                    className="d-flex flex-column align-items-center "
                    onSubmit={(e) => {
                      e.preventDefault();
                      signIn(email, password);
                    }}
                  >
                    <MDBInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      icon="envelope"
                      group
                      style={{ marginBottom: "1rem" }}
                    />
                    <br />
                    <MDBInput
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      icon="lock"
                      group
                      style={{ marginBottom: "1rem" }}
                    />
                    <br />
                    <MDBBtn
                      className="custom-button"
                      type="submit"
                      style={{ marginBottom: "1rem" }}
                    >
                      Sign In
                    </MDBBtn>
                  </form>
                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}

                  <p className="small mb-3 pb-lg-2">
                    <a
                      className="text-white-50"
                      onClick={handlePasswordReset}
                      style={{ cursor: "pointer" }}
                    >
                      Forgot password?
                    </a>
                  </p>
                  <div className="d-flex flex-row mt-3 mb-5">
                    <MDBBtn
                      tag="a"
                      color="none"
                      className="m-3"
                      style={{ color: "white" }}
                    >
                      <MDBIcon fab icon="facebook-f" size="lg" />
                    </MDBBtn>

                    <MDBBtn
                      tag="a"
                      color="none"
                      className="m-3"
                      style={{ color: "white" }}
                    >
                      <MDBIcon fab icon="twitter" size="lg" />
                    </MDBBtn>

                    <MDBBtn
                      tag="a"
                      color="none"
                      className="m-3"
                      style={{ color: "white" }}
                    >
                      <MDBIcon fab icon="google" size="lg" />
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        )}
      </MDBContainer>
    </div>
  );
};

export default SignIn;
