import React, { useState } from "react";
import "../CSS/signin.css";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function Signin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("User authenticated, now creating database entry...");

      // Create user document in Firestore
      await setDoc(doc(db, "users", userId), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      console.log("User data saved in Firestore.");

      setMessage("Sign-up successful!");
      navigate("/preferences"); // Redirect to preferences page after successful sign-up
    } catch (err) {
      console.error("Error during sign-up:", err);
      setError("Sign-up failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Sign-in successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signupCanvas">
      <div className="signin-container">
        <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>

        {/* Conditionally render sign-up form */}
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="signin-input"
            />
          </>
        )}

        {/* Common form fields */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signin-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signin-input"
        />

        {/* Conditionally render sign-up or sign-in button */}
        {isSignUp ? (
          <button onClick={handleSignUp} className="sign-up-button">
            Sign Up
          </button>
        ) : (
          <button onClick={handleSignIn} className="sign-in-button">
            Sign In
          </button>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {/* Messages for user feedback */}
        {message && <div className="message">{message}</div>}
        {error && (
          <div className="message" style={{ color: "red" }}>
            {error}
          </div>
        )}

        {/* Toggle between sign-up and sign-in */}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="toggle-button"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default Signin;
