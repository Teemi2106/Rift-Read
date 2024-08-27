import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";
import SignIn from "./Pages/Signin";
import { useAuth } from "./useAuth";
import Preferences from "./Components/Preferences";
import BookDetails from "./Pages/BookDetails";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
        </>
      ) : (
        <>
          <Route path="/preferences" element={<Preferences user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/book/:bookId" element={<BookDetails />} />
        </>
      )}
    </Routes>
  );
}

export default App;
