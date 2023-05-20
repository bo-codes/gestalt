import { NavLink, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import "./Navbar.css";

const navData = {
  logo: logo,
  navLinks: [
    { label: "Home", path: "/" },
    { label: "Work", path: "/work" },
    { label: "About", path: "/about" },
    // { label: "Services", path: "/services" },
  ],
};

const Navbar = () => {
  const location = useLocation();
  const currPath = location.pathname;

  return (
    <div id="navbar-container">
      <img id="nav-logo" src={logo} alt='Gestalt3D logo'/>
      <ul id="navlink-container">
        {navData.navLinks.map((navlink, i) => {
          return (
            <li key={i}>
              <NavLink
                to={navlink.path}
                className={
                  currPath === navlink.path ? "selected-navlink navlink" : "navlink"
                }
              >
                {navlink.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
