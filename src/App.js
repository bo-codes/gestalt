import React from "react";
import { Route, Routes } from "react-router-dom";
// import ComingSoon from "./Components/pages/ComingSoon/ComingSoon";
import WorkPage from "./Components/pages/WorkPage/WorkPage";
import AboutPage from "./Components/pages/AboutPage/AboutPage";
import ServicesPage from "./Components/pages/ServicesPage/ServicesPage";
import HomePage from "./Components/pages/HomePage/HomePage";
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
