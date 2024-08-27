import React, { useEffect, useState } from "react";
import "../CSS/Homepage.css";
import logo from "../Assets/icon-white.png";
import { Button, Center, Image } from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const mainRef1 = useRef(null);
  const mainRef2 = useRef(null);
  const scrollSpeed = 1;

  useEffect(() => {
    const fetchLatestBooks = async () => {
      const apiKey = "AIzaSyAZsjB-iFtJ_cVJD06NnLyXE1pUEKvDFyQ"; // Replace with your actual API key
      const url = `https://www.googleapis.com/books/v1/volumes?q=subject:mystery&orderBy=newest&maxResults=6&key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLatestBooks(data.items || []);
      } catch (error) {
        console.error("Error fetching latest books:", error);
      }
    };

    fetchLatestBooks();
  }, []);
  useEffect(() => {
    const main1 = mainRef1.current;

    const cloneContent = () => {
      const content = main1.innerHTML;
      main1.innerHTML += content; // Duplicate the content inside main1
    };

    const scrollTabs = () => {
      main1.scrollLeft += scrollSpeed;
      if (main1.scrollLeft >= main1.scrollWidth / 2) {
        main1.scrollLeft = 0; // Reset scroll position to the start
      }
    };

    cloneContent(); // Clone the content once to double its width
    const scrollInterval = setInterval(scrollTabs, 20); // Adjust the interval time for smoother or choppier scrolling

    return () => {
      clearInterval(scrollInterval);
    };
  }, []);

  useEffect(() => {
    const main2 = mainRef2.current;

    const cloneContent = () => {
      const content = main2.innerHTML;
      main2.innerHTML += content; // Duplicate the content inside main2
    };

    const scrollTabs = () => {
      main2.scrollLeft -= scrollSpeed; // Reverse the direction for the second section
      if (main2.scrollLeft <= 0) {
        main2.scrollLeft = main2.scrollWidth / 2; // Reset scroll position to the middle
      }
    };

    cloneContent(); // Clone the content once to double its width
    const scrollInterval = setInterval(scrollTabs, 20); // Adjust the interval time for smoother or choppier scrolling

    return () => {
      clearInterval(scrollInterval);
    };
  }, []);
  const navigate = useNavigate();
  const navigateSignIn = () => {
    navigate("/signin");
  };

  return (
    <div>
      <section id="homeHero">
        <header id="homeHeader">
          <Image src={logo} boxSize="150px" />
          <Button
            backgroundColor={"#66351A"}
            color={"#fff"}
            onClick={navigateSignIn}
          >
            SIGN IN
          </Button>
        </header>
        <Center style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: "6vmin", fontWeight: "bold", color: "#fff" }}>
            Personalized Stories
          </h1>
          <h2
            style={{
              fontSize: "4vmin",
              fontWeight: "bold",
              color: "#000",
              zIndex: 999,
            }}
          >
            Tailored To Your Preferences
          </h2>
        </Center>
      </section>
      <section id="transparent-section"></section>
      <section id="main1" ref={mainRef1}>
        <div className="brown-tabs">Romance</div>
        <div className="brown-tabs">Crime</div>
        <div className="brown-tabs">Sci-Fi</div>
        <div className="brown-tabs">Mystery</div>
        <div className="brown-tabs">Horror</div>
        <div className="brown-tabs">Comedy</div>
      </section>
      <section id="main2" ref={mainRef2}>
        <div className="brown-tabs">Romance</div>
        <div className="brown-tabs">Crime</div>
        <div className="brown-tabs">Sci-Fi</div>
        <div className="brown-tabs">Mystery</div>
        <div className="brown-tabs">Horror</div>
        <div className="brown-tabs">Comedy</div>
      </section>
      <section id="others">
        <h2>Latest Stories</h2>
        <div className="latest-books">
          {latestBooks.map((book) => (
            <div key={book.id} className="book-item">
              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
                className="book-cover"
              />
              <div className="book-details">
                <h3 className="book-title">{book.volumeInfo.title}</h3>
                <p className="book-author">
                  {book.volumeInfo.authors?.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
