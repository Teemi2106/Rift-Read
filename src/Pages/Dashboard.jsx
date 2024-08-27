import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../CSS/dashboard.css";

const Dashboard = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooksByPreferences = async () => {
      if (!user || !user.preferences || user.preferences.length === 0) {
        setLoading(false);
        return;
      }

      const preferencesQuery = user.preferences
        .map((preference) => `subject:${preference}`)
        .join("+");

      const apiKey = "AIzaSyAZsjB-iFtJ_cVJD06NnLyXE1pUEKvDFyQ"; // Replace with your actual API key
      const url = `https://www.googleapis.com/books/v1/volumes?q=${preferencesQuery}&orderBy=newest&maxResults=40&key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const books = data.items || [];

        // Shuffle the books array to randomize it
        for (let i = books.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [books[i], books[j]] = [books[j], books[i]];
        }

        setBooks(books);
        setFilteredBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksByPreferences();
  }, [user]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
      return;
    }

    const apiKey = "AIzaSyAZsjB-iFtJ_cVJD06NnLyXE1pUEKvDFyQ"; // Replace with your actual API key
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=20&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFilteredBooks(data.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the home page or sign-in page after signing out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`); // Navigate to the BookDetails page
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <main>
      <div id="dashboardCont">
        <div className="dashboard-container">
          <h1 className="dashboard-header">
            Welcome, {user.displayName || "User"}
          </h1>
          <button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
      <h2 id="newStories">New Stories For You</h2>
      <section id="storiesSection">
        {filteredBooks.length > 0 ? (
          <div className="books-container">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="book-item"
                onClick={() => handleBookClick(book.id)} // Set onClick handler
              >
                <img
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/128x192?text=No+Image"
                  }
                  alt={`${book.volumeInfo.title} cover`}
                  className="book-image"
                />
                <h4>{book.volumeInfo.title}</h4>
                <p>{book.volumeInfo.authors?.join(", ")}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No books found.</p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
