import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import "../CSS/preferences.css"; // Import the new stylesheet

const Preferences = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Science Fiction",
    "Biography",
    "Romance",
    "Thriller",
    "Historical Fiction",
    "Horror",
    "Self-Help",
    "Young Adult",
    "Children's",
    "Graphic Novels",
    "Poetry",
    "Classic Literature",
    "Adventure",
    "Science",
    "Travel",
    "Cookbooks",
    "True Crime",
    "Business",
    "Health",
    "Political",
    "Religion",
    "Spirituality",
    "Philosophy",
  ];

  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSavePreferences = async () => {
    if (selectedGenres.length < 2) {
      setError("Please select at least two genres.");
      return;
    }

    setError(""); // Clear any previous error messages

    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);

      await updateDoc(userDocRef, {
        preferences: selectedGenres,
      });

      navigate("/dashboard"); // Redirect to the dashboard after saving preferences
    } catch (err) {
      console.error("Error updating preferences:", err);
      setError("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div id="prefCont">
      <div className="preferences-container">
        <h1 className="preferences-header">Select Your Book Preferences</h1>
        <div className="genre-list">
          {genres.map((genre) => (
            <div key={genre} className="genre-item">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
              />
              <label>{genre}</label>
            </div>
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}{" "}
        {/* Display error message */}
        <button onClick={handleSavePreferences} className="save-button">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Preferences;
