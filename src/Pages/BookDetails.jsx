import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../CSS/bookDetails.css";

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(book);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const apiKey = "AIzaSyAZsjB-iFtJ_cVJD06NnLyXE1pUEKvDFyQ"; // Replace with your actual API key
      const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!book) {
    return <div>Book not found.</div>;
  }

  const bookLink = book.volumeInfo.canonicalVolumeLink;
  const previewLink = book.accessInfo?.webReaderLink;
  const downloadLink =
    book.accessInfo?.pdf?.downloadLink || book.accessInfo?.epub?.downloadLink;

  return (
    <div className="book-details">
      <h1>{book.volumeInfo.title}</h1>
      <img
        src={
          book.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/128x192?text=No+Image"
        }
        alt={`${book.volumeInfo.title} cover`}
        className="book-image"
      />
      <p>
        <strong>Authors:</strong> {book.volumeInfo.authors?.join(", ")}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {book.volumeInfo.description || "No description available."}
      </p>
      {previewLink && (
        <a
          href={previewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="read-preview-link"
        >
          Read Preview
        </a>
      )}
      {downloadLink ? (
        <a
          href={downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          className="read-preview-link"
        >
          Download Book
        </a>
      ) : previewLink ? (
        <p>No download available, but you can read the preview.</p>
      ) : (
        <p>No preview or download available.</p>
      )}
      {bookLink && (
        <a
          href={bookLink}
          target="_blank"
          rel="noopener noreferrer"
          className="read-preview-link"
        >
          View Book on Google Books
        </a>
      )}
    </div>
  );
};

export default BookDetails;
