import React from "react";
import { Route, Routes } from "react-router-dom";
// import ComingSoon from "./Components/pages/ComingSoon/ComingSoon";
import WorkPage from "./pages/WorkPage/WorkPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import HomePage from "./pages/HomePage/HomePage";
import Navbar from "./Components/Navbar/Navbar";

export default function App() {

  return (
    <div id="main-div">
      <Navbar />
      <Routes>
        <Route path="/" exact={true} element={<HomePage />} />
        <Route path="/work" exact={true} element={<WorkPage />} />
        <Route path="/about" exact={true} element={<AboutPage />} />
        <Route path="/services" exact={true} element={<ServicesPage />} />
      </Routes>
    </div>
  );
}
